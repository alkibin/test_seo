from sqlalchemy import case, exists, or_, select, and_, tuple_, func
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import async_session_general
from sqlalchemy.orm import aliased
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.sql.elements import UnaryExpression

from api.auth.models import User, GroupUserAssociation
from api.config.models import AutoUpdatesMode, Config, Group, GroupConfigAssociation, Role, UserQueryCount, \
     ListLrSearchSystem, LiveSearchListQuery, List, LiveSearchList, LiveSearchAutoUpdateSchedule, YandexLr
from db.session import async_session_general
from services.load_live_search import main as live_search_main


async def load_auto_updates_schedule(session: AsyncSession) -> list[LiveSearchAutoUpdateSchedule, User]:
    result = await session.execute(
        select(LiveSearchAutoUpdateSchedule, User)
        .join(User, LiveSearchAutoUpdateSchedule.user_id == User.id)
        .where(LiveSearchAutoUpdateSchedule.mode != AutoUpdatesMode.Disabled)
    )
    return result.all()


async def update_list(user: User, list_id: int):
    async with async_session_general() as session:
        live_search_list: LiveSearchList = (
            await session.execute(select(LiveSearchList).where(LiveSearchList.id == list_id))
        ).scalars().first()
        main_domain = live_search_list.main_domain
        lists_lr: list[ListLrSearchSystem] = (await session.execute(
            select(ListLrSearchSystem)
            .where(ListLrSearchSystem.list_id == live_search_list.id)
        )).scalars().all()

        for list_lr in lists_lr:
            lr, search_system = list_lr.lr, list_lr.search_system
            status = await live_search_main(list_lr.id, list_id, main_domain, lr, search_system, user, session)
            if status == 0:
                return


async def load_live_search(user, list_lr_id: int, session: AsyncSession):
    list_lr = (await session.execute(select(ListLrSearchSystem).where(ListLrSearchSystem.id == list_lr_id))).scalars().first()

    list_id, lr, search_system = list_lr.list_id, list_lr.lr, list_lr.search_system

    main_domain = (await session.execute(select(LiveSearchList.main_domain).where(LiveSearchList.id == list_id))).scalars().first()

    return await live_search_main(list_lr_id, list_id, main_domain, lr, search_system, user, session)


async def load_live_search(user, list_lr_id: int, session: AsyncSession):
    list_lr = (await session.execute(select(ListLrSearchSystem).where(ListLrSearchSystem.id == list_lr_id))).scalars().first()

    list_id, lr, search_system = list_lr.list_id, list_lr.lr, list_lr.search_system

    main_domain = (await session.execute(select(LiveSearchList.main_domain).where(LiveSearchList.id == list_id))).scalars().first()

    return await live_search_main(list_lr_id, list_id, main_domain, lr, search_system, user, session)


async def get_config_names(session: AsyncSession, user: User, group_name):
    query = select(Group.id).where(Group.name == group_name)
    group_id = (await session.execute(query)).fetchone()
    if group_id:
        group_id = group_id[0]
    query = (select(Config.name)
             .join(GroupConfigAssociation, GroupConfigAssociation.config_id == Config.id)
             .where(GroupConfigAssociation.group_id == group_id))
    res = (await session.execute(query)).all()
    return res


async def get_config_info(
        session: AsyncSession,
        config_name: str,
        config_user: int
):
    query = select(Config).where(and_(Config.name == config_name))
    result = (await session.execute(query)).scalars().first()
    return result


async def get_group_names(session: AsyncSession, user: User):
    query = (
        select(Group.name)
        .join(GroupUserAssociation, GroupUserAssociation.group_id == Group.id)
        .where(GroupUserAssociation.user_id == user.id)
    )
    result = (await session.execute(query)).all()
    return [row[0] for row in result]


async def get_groups_names_dict(
    session: AsyncSession,
):
    group_dict = (await session.execute(select(Group.id, Group.name, Group.id_author))).fetchall()
    result = {id_: (name, id_author) for id_, name, id_author in group_dict}
    return dict(result)


async def get_lists_names(
    session: AsyncSession,
    user: User,
    current_group: str,
    config_id: int,
    group_id: int,
):
    stmt = select(List).where(
        or_(and_(List.author == user.id, List.config == config_id), case((List.group == group_id, List.is_public == True), else_=False))
    )

    result = await session.execute(stmt)
    return result.scalars().all()


async def get_live_search_lists_names(
    session: AsyncSession,
    user: User,
):
    stmt = (
        select(LiveSearchList, func.count(LiveSearchListQuery.id).label("query_count"))
        .outerjoin(LiveSearchListQuery, LiveSearchList.queries)
        .where(LiveSearchList.author == user.id)
        .group_by(LiveSearchList.id)
    )
    print(stmt)
    result = await session.execute(stmt)
    result = result.all()
    lists = [None] * len(result)
    for i, (list_, query_count) in enumerate(result):
        list_.query_count = query_count
        lists[i] = list_
    return lists


async def get_live_search_lists_names_with_pagination(
        session: AsyncSession,
        page: int,
        per_page: int,
        user: User,
        order_by = None,
):
    stmt = (
        select(
            LiveSearchList,
            func.count(LiveSearchListQuery.id).label("query_count"),
            func.count(LiveSearchList.id).over(partition_by=LiveSearchList.author).label("total_list_count")
        )
        .outerjoin(LiveSearchListQuery, LiveSearchList.queries)
        .where(LiveSearchList.author == user.id)
        .limit(per_page)
        .offset(per_page * (page - 1))
        .order_by(order_by if order_by is not None else LiveSearchList.id.asc())
        .group_by(LiveSearchList.id)
    )
    print(stmt, stmt.params())
    result = await session.execute(stmt)
    result = result.all()

    total_lists_count = result[0].total_list_count
    lists = [None] * len(result)
    for i, (list_, query_count, _) in enumerate(result):
        list_.query_count = query_count
        lists[i] = list_
    # print(f"lists: {lists}, total_lists_count: {total_lists_count}")
    return lists, total_lists_count
    # return lists


async def get_all_user(
    session: AsyncSession,
):
    users = (await session.execute(select(User,#.id,
                                #User.email, 
                                #User.username, 
                                #User.role,
                                #User.groups,
                                UserQueryCount.query_count.label("query_count")
                                ).outerjoin(UserQueryCount, UserQueryCount.user_id == User.id))
                                ).all()
    users_with_query_count = [
        (user, query_count) for user, query_count in users
    ]

    users_with_query_count.sort(key=lambda x: x[0].id)  # Сортируем по id пользователя

    return users_with_query_count

    #users.sort(key=lambda x: x.id)
    #return users


async def get_all_groups(
    session: AsyncSession,
):
    users = (await session.execute(select(Group))).scalars().all()

    users.sort(key=lambda x: x.id)

    return users


async def get_all_roles(
    session: AsyncSession,
):
    roles = (await session.execute(select(Role.id, Role.name))).fetchall()

    return dict(roles)


async def get_all_groups_for_user(
    session: AsyncSession,
    user_id: int,
):
    stmt = select(
        Group).join(
        GroupUserAssociation, GroupUserAssociation.group_id == Group.id).where(
        GroupUserAssociation.user_id == user_id)
    
    group_names = (await session.execute(stmt)).scalars().all()

    return group_names


async def get_all_configs(
    session: AsyncSession,
):
    configs = (await session.execute(select(Config))).scalars().all()

    return configs