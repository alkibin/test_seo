from datetime import datetime, timedelta
from typing import List

from fastapi import logger
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import asc, case, select, distinct, delete, text
from sqlalchemy import and_
from sqlalchemy import desc, func, or_

from db.models import QueryIndicator, QueryUrlTop, QueryUrlsMerge, Url
from db.models import Metrics
from db.models import MetricsView
from db.models import Query
from db.models import MetricsQueryView
from db.models import MetricsQuery
from db.utils import get_last_update_date

from api.config.models import List as List_model, ListURI

from const import date_format

###########################################################
# BLOCK FOR INTERACTION WITH DATABASE IN BUSINESS CONTEXT #
###########################################################


class UrlDAL:
    """Data Access Layer for operating user info"""

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def add_new_urls(
            self,
            add_values
    ):
        for value in add_values:
            await self.db_session.merge(value)
        await self.db_session.flush()
        return

    async def get_urls_with_pagination(
            self, 
            page, 
            per_page, 
            date_start, 
            date_end, 
            state, 
            state_date, 
            metric_type, 
            state_type, 
            list_name,
            general_db
            ):

        filter_query = None
        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()
            
            #filter_query = Url.url.in_(uri_list)

            #filter_query_result = Metrics.url.in_(uri_list)

            url_id_list = (await self.db_session.execute(
                select(Url.id).where(Url.url.in_(uri_list)))).scalars().all()

            # Фильтрация по Url.id на основе uri_list
            if url_id_list:
                filter_query = Url.id.in_(url_id_list)
                filter_query_result = MetricsView.url_id.in_(url_id_list)

        if metric_type == "P":
            pointer = MetricsView.position
            result_pointer = func.avg(MetricsView.position)
        if metric_type == "K":
            pointer = MetricsView.clicks
            result_pointer = func.sum(MetricsView.clicks)
        if metric_type == "R":
            pointer = MetricsView.impression
            result_pointer = func.sum(MetricsView.impression)
        if metric_type == "C":
            pointer = MetricsView.ctr
            result_pointer = func.avg(MetricsView.ctr)
        
        sub_query = select(Url)

        sub_query_result = select(MetricsView.url_id).join(Url, Url.id == MetricsView.url_id)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

            sub_query_result = sub_query_result.filter(filter_query_result)

        if not state:
            
            sub = sub_query.offset(page).limit(per_page).subquery()
            query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                        MetricsView.ctr, sub.c.url).join(sub,
                                                    MetricsView.url_id == sub.c.id).group_by(
                sub.c.id, sub.c.url,  
                MetricsView.date,   
                MetricsView.position,
                MetricsView.clicks,
                MetricsView.impression,
                MetricsView.ctr,
            ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))

        elif state == "decrease":
            if state_type == "date":

                sub = sub_query_result.where(MetricsView.date == state_date).order_by(desc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id == sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)
            else:
                sub = sub_query_result.where(
                    and_(MetricsView.date >= date_start, MetricsView.date <= date_end)).group_by(MetricsView.url_id).order_by(
                    desc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id == sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)
        
        elif state == "increase":
            if pointer == MetricsView.position:
                    pointer = case(
                        (pointer == 0, float('inf')),  # если pointer == 0, заменяем на float('inf')
                        else_=pointer  # иначе используем значение pointer
                    )
            if state_type == "date":

                sub = sub_query_result.where(MetricsView.date == state_date).group_by(MetricsView.url_id, Url.id, pointer).order_by(asc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id == sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)
            else:
                sub = sub_query_result.where(
                    and_(MetricsView.date >= date_start, MetricsView.date <= date_end)).group_by(MetricsView.url_id, Url.url, Url.id, pointer).order_by(
                    asc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id == sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)

        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_urls_with_pagination_and_like(
            self, 
            page, 
            per_page, 
            date_start, 
            date_end, 
            search_text, 
            state, 
            state_date, 
            metric_type, 
            state_type,
            list_name,
            general_db,
            ):
        
        filter_query = None


        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()
            
            #filter_query = Url.url.in_(uri_list)

            #filter_query_result = Metrics.url.in_(uri_list)

            url_id_list = (await self.db_session.execute(
                select(Url.id).where(Url.url.in_(uri_list)))).scalars().all()

            # Фильтрация по Url.id на основе uri_list
            if url_id_list:
                filter_query = Url.id.in_(url_id_list)
                filter_query_result = MetricsView.url_id.in_(url_id_list)

        if metric_type == "P":
            pointer = MetricsView.position
            result_pointer = func.avg(MetricsView.position)
        if metric_type == "K":
            pointer = MetricsView.clicks
            result_pointer = func.sum(MetricsView.clicks)
        if metric_type == "R":
            pointer = MetricsView.impression
            result_pointer = func.sum(MetricsView.impression)
        if metric_type == "C":
            pointer = MetricsView.ctr
            result_pointer = func.avg(MetricsView.ctr)
        
        sub_query = select(Url)

        sub_query_result = select(MetricsView.url_id)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

            sub_query_result = sub_query_result.filter(filter_query_result)

        if not state:
            sub = sub_query.filter(Url.url.like(f"%{search_text.strip()}%")).offset(page).limit(
                per_page).subquery()
            query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                        MetricsView.ctr, sub).join(sub, MetricsView.url_id == sub.c.id).group_by(
                sub.c.id, sub.c.url,
                MetricsView.date,
                MetricsView.position,
                MetricsView.clicks,
                MetricsView.impression,
                MetricsView.ctr,
            ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))

        elif state == "decrease":
            if state_type == "date":

                sub = sub_query_result.join(Url, Url.id == MetricsView.url_id).filter(Url.url.like(f"%{search_text.strip()}%")).where(MetricsView.date == state_date).group_by(MetricsView.url_id, pointer).order_by(desc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id == sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)
            else:

                sub = sub_query_result.join(Url, Url.id == MetricsView.url_id).filter(Url.url.like(f"%{search_text.strip()}%")).where(
                    and_(MetricsView.date >= date_start, MetricsView.date <= date_end)).group_by(MetricsView.url_id).order_by(
                    desc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id == sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)
        
        elif state == "increase":
            if pointer == MetricsView.position:
                    pointer = case(
                        (pointer == 0, float('inf')),  # если pointer == 0, заменяем на float('inf')
                        else_=pointer  # иначе используем значение pointer
                    )
            if state_type == "date":

                sub = sub_query_result.join(Url, Url.id == MetricsView.url_id).filter(Url.url.like(f"%{search_text.strip()}%")).where(MetricsView.date == state_date).group_by(MetricsView.url_id, pointer).order_by(asc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id ==  sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)
            else:

                sub = sub_query_result.join(Url, Url.id == MetricsView.url_id).filter(Url.url.like(f"%{search_text.strip()}%")).where(
                    and_(MetricsView.date >= date_start, MetricsView.date <= date_end)).group_by(MetricsView.url_id, pointer).order_by(
                    asc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression,
                            MetricsView.ctr, Url.url).join(sub,
                                                        MetricsView.url_id ==  sub.c.url_id).group_by(
                    sub.c.url_id, Url.url,
                    MetricsView.date,
                    MetricsView.position,
                    MetricsView.clicks,
                    MetricsView.impression,
                    MetricsView.ctr,
                ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)).join(Url, MetricsView.url_id == Url.id)

        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_urls_with_pagination_sort(
            self, 
            page, 
            per_page, 
            date_start, 
            date_end, 
            sort_desc,
            list_name,
            general_db,
            ):

        filter_query = None

        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()
            
            #filter_query = Url.url.in_(uri_list)
            url_id_list = (await self.db_session.execute(
                select(Url.id).where(Url.url.in_(uri_list)))).scalars().all()

            # Фильтрация по Url.id на основе uri_list
            if url_id_list:
                filter_query = Url.id.in_(url_id_list)

        
        sub_query = select(Url)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)
            
        if sort_desc:
            sub = sub_query.order_by(desc(Url.url)).offset(page).limit(
                per_page).subquery()
        else:
            sub = sub_query.order_by(Url.url).offset(page).limit(
                per_page).subquery()
        query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression, MetricsView.ctr, sub.c.url).join(sub,
                                                                                                                MetricsView.url_id == sub.c.id).group_by(
        sub.c.id, sub.c.url,
        MetricsView.date,
        MetricsView.position,
        MetricsView.clicks,
        MetricsView.impression,
        MetricsView.ctr,
        ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))
        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_urls_with_pagination_and_like_sort(
            self, 
            page, 
            per_page, 
            date_start, 
            date_end, 
            search_text,
            sort_desc,
            list_name,
            general_db,
            ):

        filter_query = None

        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()

            filter_query = Url.url.in_(uri_list)
        
        sub_query = select(Url)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

        if sort_desc:
            sub = sub_query.filter(Url.url.like(f"%{search_text.strip()}%")).order_by(desc(Url.url)).offset(
                page).limit(per_page).subquery()
        else:
            sub = sub_query.filter(Url.url.like(f"%{search_text.strip()}%")).order_by(Url.url).offset(page).limit(
                per_page).subquery()
        query = select(MetricsView.date, MetricsView.position, MetricsView.clicks, MetricsView.impression, MetricsView.ctr, sub.c.url).join(sub,
                                                                                                                  MetricsView.url_id == sub.c.id).group_by(
            sub.c.id, sub.c.url,
            MetricsView.date,
            MetricsView.position,
            MetricsView.clicks,
            MetricsView.impression,
            MetricsView.ctr,
        ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))
        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row
        
    async def get_metrics_daily_summary_like(self, date_start, date_end, search_text, list_name, general_db):

        filter_query = None

        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()

            filter_query = Url.url.in_(uri_list)
        sub_query = select(Url)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

        sub = sub_query.filter(Url.url.like(f"%{search_text.strip()}%")).subquery()
        query = select(MetricsView.date, MetricsView.clicks, MetricsView.impression
                    ).join(sub, MetricsView.url_id == sub.c.id
                    ).group_by(MetricsView.date,
                    ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))
        
        query = select(MetricsView.date, 
                    func.sum(MetricsView.clicks).label('total_clicks'),
                    func.sum(MetricsView.impression).label('total_impressions'),
                    
                    ).join(sub, MetricsView.url_id == sub.c.id
                    ).group_by(MetricsView.date,
                    ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))
        
        res = await self.db_session.execute(query)
        
        product_row = res.fetchall()
        
        # Запрос для подсчета количества уникальных URL с метриками в заданный период
        count_query = select(func.count(func.distinct(MetricsView.url_id))).join(
            sub, MetricsView.url_id == sub.c.id
        ).filter(
            and_(MetricsView.date <= date_end, MetricsView.date >= date_start)
        )

        total_records = await self.db_session.execute(count_query)
        total_records_count = total_records.scalar()

        if len(product_row) != 0:
            return product_row, total_records_count

    async def get_metrics_daily_summary(self, date_start, date_end, list_name, general_db):

        filter_query = None

        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()

            filter_query = Url.url.in_(uri_list)
        sub_query = select(Url)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

        sub = sub_query.subquery()    

        query = select(MetricsView.date, 
                    func.sum(MetricsView.clicks).label('total_clicks'),
                    func.sum(MetricsView.impression).label('total_impressions'),
                    ).join(sub, MetricsView.url_id == sub.c.id
                    ).group_by(MetricsView.date,
                    ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start)      
                )  
        
        res = await self.db_session.execute(query)
        product_row = res.fetchall()

        # Запрос для подсчета количества уникальных URL с метриками в заданный период
        count_query = select(func.count(func.distinct(MetricsView.url_id))).filter(
            and_(MetricsView.date <= date_end, MetricsView.date >= date_start)
        )

        total_records = await self.db_session.execute(count_query)
        total_records_count = total_records.scalar()

        if len(product_row) != 0:
            return product_row, total_records_count
        
    async def get_not_void_count_daily_summary_like(self, date_start, date_end, search_text, list_name, general_db):

        filter_query = None

        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()

            filter_query = Url.url.in_(uri_list)
        sub_query = select(Url)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

        sub = sub_query.filter(Url.url.like(f"%{search_text.strip()}%")).subquery()

        # Запрос для всех топов с использованием CASE для подсчета
        top_count_query = select(
            MetricsView.date.label("date"),
            func.count().label("total_count"),
            func.sum(case((MetricsView.position <= 3, 1), else_=0)).label("top_3_count"),
            func.sum(case((MetricsView.position <= 5, 1), else_=0)).label("top_5_count"),
            func.sum(case((MetricsView.position <= 10, 1), else_=0)).label("top_10_count")
        ).join(sub, MetricsView.url_id == sub.c.id
        ).where(MetricsView.position > 0
        ).group_by(MetricsView.date
        ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))

        res = await self.db_session.execute(top_count_query)

        results = res.fetchall()

        if results:
            return results
        
    async def get_not_void_count_daily_summary(self, date_start, date_end, list_name, general_db):

        filter_query = None

        if list_name != "None":
            list_id = (await general_db.execute(
                select(List_model.id).where(List_model.name == list_name)
            )).fetchone()[0]

            uri_list = (await general_db.execute(
                select(ListURI.uri).where(ListURI.list_id == list_id)
            )).scalars().all()

            filter_query = Url.url.in_(uri_list)
        sub_query = select(Url)
            
        if filter_query is not None:
            sub_query = sub_query.filter(filter_query)

        sub = sub_query.subquery()    

        # Запрос для всех топов с использованием CASE для подсчета
        top_count_query = select(
            MetricsView.date.label("date"),
            func.count().label("total_count"),
            func.sum(case((MetricsView.position <= 3, 1), else_=0)).label("top_3_count"),
            func.sum(case((MetricsView.position <= 5, 1), else_=0)).label("top_5_count"),
            func.sum(case((MetricsView.position <= 10, 1), else_=0)).label("top_10_count")
        ).join(sub, MetricsView.url_id == sub.c.id
        ).where(MetricsView.position > 0
        ).group_by(MetricsView.date
        ).having(and_(MetricsView.date <= date_end, MetricsView.date >= date_start))

        res = await self.db_session.execute(top_count_query)

        results = res.fetchall()

        if results:
            return results

class MetricDAL:
    """Data Access Layer for operating user info"""

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def add_new_metrics(
            self,
            add_values
    ):
        self.db_session.add_all(add_values)
        await self.db_session.flush()
        return

    async def get_top_data(
            self,
            top: int
    ):
        query = select(MetricsView.impression, MetricsView.clicks, MetricsView.position, MetricsView.date).where(and_(
            MetricsView.position <= top, MetricsView.position > 0))
        result = await self.db_session.execute(query)
        return result.fetchall()

    async def delete_data(
            self,
            date
    ):
        query = delete(Metrics).where(Metrics.date == date)
        await self.db_session.execute(query)
        await self.db_session.commit()


class QueryDAL:
    """Data Access Layer for operating user info"""

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def add_new_urls(
            self,
            add_values
    ):
        for value in add_values:
            await self.db_session.merge(value)
        await self.db_session.flush()
        return

    async def get_urls_with_pagination(self, page, per_page, date_start, date_end, state, state_date, metric_type, state_type):
        if metric_type == "P":
            pointer = MetricsQueryView.position
            result_pointer = func.avg(MetricsQueryView.position)
        if metric_type == "K":
            pointer = MetricsQueryView.clicks
            result_pointer = func.sum(MetricsQueryView.clicks)
        if metric_type == "R":
            pointer = MetricsQueryView.impression
            result_pointer = func.sum(MetricsQueryView.impression)
        if metric_type == "C":
            pointer = MetricsQueryView.ctr
            result_pointer = func.avg(MetricsQueryView.ctr)
        if not state:
            sub = select(Query.id, Query.query).offset(page).limit(
                per_page).subquery()
            query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                        MetricsQueryView.ctr, sub.c.query).join(sub,
                                                    MetricsQueryView.query_id == sub.c.id).group_by(
                sub.c.id, sub.c.query,
                MetricsQueryView.date,
                MetricsQueryView.position,
                MetricsQueryView.clicks,
                MetricsQueryView.impression,
                MetricsQueryView.ctr,
            ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))

        elif state == "decrease":
            if state_type == "date":
                sub = select(Query.id, Query.query).join(MetricsQueryView, MetricsQueryView.query_id == Query.id).where(MetricsQueryView.date == state_date).group_by(MetricsQueryView.query_id, Query.id, Query.query, pointer).order_by(desc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
            else:
                sub = select(MetricsQueryView.query_id, Query.query).join(Query, MetricsQueryView.query_id == Query.id).where(
                    and_(MetricsQueryView.date >= date_start, MetricsQueryView.date <= date_end)).group_by(MetricsQueryView.query_id, Query.query).order_by(
                    desc(result_pointer)).offset(page).limit(per_page).subquery()
                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.query_id).group_by(
                    sub.c.query_id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        
        elif state == "increase":
            if state_type == "date":
                if pointer == MetricsQueryView.position:
                    pointer = case(
                        (pointer == 0, float('inf')),  # если pointer == 0, заменяем на float('inf')
                        else_=pointer  # иначе используем значение pointer
                    )
                sub = select(Query.id, Query.query).join(MetricsQueryView, 
                            MetricsQueryView.query_id == Query.id).where(MetricsQueryView.date == state_date).group_by(Query.query, Query.id, pointer).order_by(asc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
            else:
                sub = select(Query.id, Query.query).join(MetricsQueryView, MetricsQueryView.query_id == Query.id).where(
                    and_(MetricsQueryView.date >= date_start, MetricsQueryView.date <= date_end)).group_by(Query.query, Query.id, pointer).order_by(
                    asc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))

        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_urls_with_pagination_and_like(self, page, per_page, date_start, date_end, search_text, state, state_date, metric_type, state_type):
        if metric_type == "P":
            pointer = MetricsQueryView.position
            result_pointer = func.avg(MetricsQueryView.position)
        if metric_type == "K":
            pointer = MetricsQueryView.clicks
            result_pointer = func.sum(MetricsQueryView.clicks)
        if metric_type == "R":
            pointer = MetricsQueryView.impression
            result_pointer = func.sum(MetricsQueryView.impression)
        if metric_type == "C":
            pointer = MetricsQueryView.ctr
            result_pointer = func.avg(MetricsQueryView.ctr)
        if not state:
            sub = select(Query.id, Query.query).filter(Query.query.like(f"%{search_text.strip()}%")).offset(page).limit(
                per_page).subquery()
            query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                        MetricsQueryView.ctr, sub.c.query).join(sub,
                                                    MetricsQueryView.query_id == sub.c.id).group_by(
                sub.c.id, sub.c.query,
                MetricsQueryView.date,
                MetricsQueryView.position,
                MetricsQueryView.clicks,
                MetricsQueryView.impression,
                MetricsQueryView.ctr,
            ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))

        elif state == "decrease":

            if state_type == "date":
                sub = select(Query.id, Query.query).join(MetricsQueryView, MetricsQueryView.query_id == Query.id).filter(Query.query.like(f"%{search_text.strip()}%")).where(MetricsQueryView.date == state_date).group_by(Query.query, Query.id, pointer).order_by(desc(pointer)).offset(page).limit(per_page).subquery()
                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
            else:
                sub = select(Query.id, Query.query).join(MetricsQueryView, MetricsQueryView.query_id == Query.id).filter(Query.query.like(f"%{search_text.strip()}%")).where(
                    and_(MetricsQueryView.date >= date_start, MetricsQueryView.date <= date_end)).group_by(Query.query, Query.id).order_by(
                    desc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        
        elif state == "increase":
            if pointer == MetricsQueryView.position:
                    pointer = case(
                        (pointer == 0, float('inf')),  # если pointer == 0, заменяем на float('inf')
                        else_=pointer  # иначе используем значение pointer
                    )
            if state_type == "date":
                sub = select(Query.id, Query.query).join(MetricsQueryView, MetricsQueryView.query_id == Query.id).filter(Query.query.like(f"%{search_text.strip()}%")).where(MetricsQueryView.date == state_date).group_by(Query.query, Query.id, pointer).order_by(asc(pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
            else:
                sub = select(Query.id, Query.query).join(MetricsQueryView, MetricsQueryView.query_id == Query.id).filter(Query.query.like(f"%{search_text.strip()}%")).where(
                    and_(MetricsQueryView.date >= date_start, MetricsQueryView.date <= date_end)).group_by(Query.query, Query.id).order_by(
                    asc(result_pointer)).offset(page).limit(per_page).subquery()

                query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                            MetricsQueryView.ctr, sub.c.query).join(sub,
                                                        MetricsQueryView.query_id == sub.c.id).group_by(
                    sub.c.id, sub.c.query,
                    MetricsQueryView.date,
                    MetricsQueryView.position,
                    MetricsQueryView.clicks,
                    MetricsQueryView.impression,
                    MetricsQueryView.ctr,
                ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))

        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_urls_with_pagination_sort(self, page, per_page, date_start, date_end, sort_desc):
        if sort_desc:
            sub = select(Query.id, Query.query).order_by(desc(Query.query)).offset(page).limit(
                per_page).subquery()
        else:
            sub = select(Query.id, Query.query).order_by(Query.query).offset(page).limit(
                per_page).subquery()
        query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                       MetricsQueryView.ctr, sub.c.query).join(sub,
                                                   MetricsQueryView.query_id == sub.c.id).group_by(
            sub.c.id, sub.c.query,
            MetricsQueryView.date,
            MetricsQueryView.position,
            MetricsQueryView.clicks,
            MetricsQueryView.impression,
            MetricsQueryView.ctr,
        ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_urls_with_pagination_and_like_sort(self, page, per_page, date_start, date_end, search_text,
                                                     sort_desc):
        if sort_desc:
            sub = select(Query.id, Query.query).filter(Query.query.like(f"%{search_text.strip()}%")).group_by(Query.query, Query.id).order_by(desc(Query.query)).offset(
                page).limit(per_page).subquery()
        else:
            sub = select(Query.id, Query.query).filter(Query.query.like(f"%{search_text.strip()}%")).group_by(Query.query, Query.id).order_by(Query.query).offset(
                page).limit(
                per_page).subquery()
        query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                       MetricsQueryView.ctr, sub.c.query).join(sub,
                                                   MetricsQueryView.query_id == sub.c.id).group_by(
            sub.c.id, sub.c.query,
            MetricsQueryView.date,
            MetricsQueryView.position,
            MetricsQueryView.clicks,
            MetricsQueryView.impression,
            MetricsQueryView.ctr,
        ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_metrics_daily_summary_like(self, date_start, date_end, search_text):
        sub = select(Query.id, Query.query).filter(Query.query.like(f"%{search_text.strip()}%")).subquery()
        query = select(MetricsQueryView.date, 
                    func.sum(MetricsQueryView.clicks).label('total_clicks'),
                    func.sum(MetricsQueryView.impression).label('total_impressions')
                    ).join(sub, MetricsQueryView.query_id == sub.c.id
                    ).group_by(MetricsQueryView.date,
                    ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        
        # Запрос для подсчета количества уникальных Query с метриками в заданный временной интервал
        count_query = select(func.count(func.distinct(MetricsQueryView.query_id))).join(
            sub, MetricsQueryView.query_id == sub.c.id
        ).filter(
            and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start)
        )

        total_records = await self.db_session.execute(count_query)
        total_records_count = total_records.scalar()

        if len(product_row) != 0:
            return product_row, total_records_count

    async def get_metrics_daily_summary(self, date_start, date_end):
        query = select(MetricsQueryView.date, 
                    func.sum(MetricsQueryView.clicks).label('total_clicks'),
                    func.sum(MetricsQueryView.impression).label('total_impressions')
                    ).group_by(MetricsQueryView.date,
                    ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        res = await self.db_session.execute(query)
        product_row = res.fetchall()
        
        # Запрос для подсчета количества уникальных Query с метриками в заданный временной интервал
        count_query = select(func.count(func.distinct(MetricsQueryView.query_id))).filter(
            and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start)
        )

        total_records = await self.db_session.execute(count_query)
        total_records_count = total_records.scalar()

        if len(product_row) != 0:
            return product_row, total_records_count
        
    async def get_not_void_count_daily_summary_like(self, date_start, date_end, search_text):
        sub = select(Query.id, Query.query).filter(Query.query.like(f"%{search_text.strip()}%")).subquery()
        # Запрос для всех топов с использованием CASE для подсчета
        top_count_query = select(
            MetricsQueryView.date.label("date"),
            func.count().label("total_count"),
            func.sum(case((MetricsQueryView.position <= 3, 1), else_=0)).label("top_3_count"),
            func.sum(case((MetricsQueryView.position <= 5, 1), else_=0)).label("top_5_count"),
            func.sum(case((MetricsQueryView.position <= 10, 1), else_=0)).label("top_10_count")
        ).join(sub, MetricsQueryView.query_id == sub.c.id
        ).where(MetricsQueryView.position > 0
        ).group_by(MetricsQueryView.date
        ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))

        res = await self.db_session.execute(top_count_query)

        results = res.fetchall()

        if results:
            return results
        
        
    async def get_not_void_count_daily_summary(self, date_start, date_end):   
        # Запрос для всех топов с использованием CASE для подсчета
        top_count_query = select(
            MetricsQueryView.date.label("date"),
            func.count().label("total_count"),
            func.sum(case((MetricsQueryView.position <= 3, 1), else_=0)).label("top_3_count"),
            func.sum(case((MetricsQueryView.position <= 5, 1), else_=0)).label("top_5_count"),
            func.sum(case((MetricsQueryView.position <= 10, 1), else_=0)).label("top_10_count")
        ).where(MetricsQueryView.position > 0
        ).group_by(MetricsQueryView.date
        ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))

        res = await self.db_session.execute(top_count_query)

        results = res.fetchall()

        if results:
            return results

class MetricQueryDAL:
    """Data Access Layer for operating user info"""

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def add_new_metrics(
            self,
            add_values
    ):
        self.db_session.add_all(add_values)
        await self.db_session.flush()
        return

    async def get_approach_query(
            self,
            session
    ):
        last_update_date = await get_last_update_date(session, MetricsQueryView)
        query = select(distinct(MetricsQueryView.query_id)).where(
            and_(MetricsQueryView.position <= 20, MetricsQueryView.date == last_update_date, MetricsQueryView.position > 0))
        result = await self.db_session.execute(query)
        return result.fetchall()

    async def get_top_data(
            self,
            top: int
    ):
        query = select(MetricsQueryView.impression, MetricsQueryView.clicks, MetricsQueryView.position, MetricsQueryView.date).where(
            and_(
                MetricsQueryView.position <= top, MetricsQueryView.position > 0))
        result = await self.db_session.execute(query)
        return result.fetchall()

    async def delete_data(
            self,
            date
    ):
        query = delete(MetricsQuery).where(MetricsQuery.date == date)
        await self.db_session.execute(query)
        await self.db_session.commit()
    

    async def delete_days(
            self,
            days_count: int,
    ):
        target_date = datetime.now() - timedelta(days=days_count)

        query = delete(MetricsQuery).where(MetricsQuery.date >= target_date)

        await self.db_session.execute(query)

        await self.db_session.commit()

        logger.info(f"Из таблицы query были удалены данные до: {target_date}")

        return 


class IndicatorDAL:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_new_indicator(
            self,
            values
    ):

        await self.session.execute(text("TRUNCATE TABLE query_indicator RESTART IDENTITY CASCADE;"))
        await self.session.commit()

        self.session.add_all(values)
        await self.session.commit()

    async def get_indicators_from_db(
            self,
            start_date,
            end_date,
    ):
        query = select(QueryIndicator.indicator, QueryIndicator.value, QueryIndicator.date).where(
            and_(QueryIndicator.date >= start_date, QueryIndicator.date <= end_date))
        res = await self.session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def add_top(
            self,
            values
    ):
        self.session.add_all(values)
        await self.session.commit()

    async def get_top_query(
            self,
            start_date,
            end_date,
            top
    ):
        query = select(QueryUrlTop.position, QueryUrlTop.clicks, QueryUrlTop.impression, QueryUrlTop.count,
                       QueryUrlTop.date).where(and_
                                               (QueryUrlTop.type == "query",
                                                QueryUrlTop.top == top,
                                                QueryUrlTop.date >= start_date,
                                                QueryUrlTop.date <= end_date))
        result = await self.session.execute(query)
        return result.fetchall()

    async def get_top_url(
            self,
            start_date,
            end_date,
            top
    ):
        query = select(QueryUrlTop.position, QueryUrlTop.clicks, QueryUrlTop.impression, QueryUrlTop.count,
                       QueryUrlTop.date).where(and_
                                               (QueryUrlTop.type == "url",
                                                QueryUrlTop.top == top,
                                                QueryUrlTop.date >= start_date,
                                                QueryUrlTop.date <= end_date))
        result = await self.session.execute(query)
        return result.fetchall()


class MergeDAL:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_merge_with_pagination(self, date, page, per_page):
        query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).offset(page).limit(
            per_page).where(QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format))
        res = await self.session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_merge_queries(self, date_start, date_end, queries: List[str]):
        sub = select(Query).where(Query.query.in_(queries)).subquery()
        query = select(MetricsQueryView.date, MetricsQueryView.position, MetricsQueryView.clicks, MetricsQueryView.impression,
                       MetricsQueryView.ctr, sub.c.query).join(sub,
                                                   MetricsQueryView.query_id == sub.c.id).group_by(
            sub.c.query,
            MetricsQueryView.date,
            MetricsQueryView.position,
            MetricsQueryView.clicks,
            MetricsQueryView.impression,
            MetricsQueryView.ctr,
        ).having(and_(MetricsQueryView.date <= date_end, MetricsQueryView.date >= date_start))
        res = await self.session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_merge_with_pagination_sort(self, date, sort_desc, page, per_page):
        if sort_desc:
            query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).order_by(desc(QueryUrlsMerge.url)).offset(
                page).limit(
                per_page).where(QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format))
        else:
            query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).order_by(QueryUrlsMerge.url).offset(
                page).limit(
                per_page).where(QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format))
        res = await self.session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_merge_with_pagination_and_like(self, date, search_text_url, search_text_query, page, per_page):
        if search_text_query:
            query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).filter(
                text("EXISTS (SELECT 1 FROM unnest(queries) AS query WHERE query LIKE :search_text)")
            ).params(search_text='%' + search_text_query.strip() + '%').offset(page).limit(per_page).where(
                QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format)
            )
        elif search_text_url:
            query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).filter(
                QueryUrlsMerge.url.like(f"%{search_text_url.strip()}%")).offset(page).limit(
                per_page).where(QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format))
        res = await self.session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row

    async def get_merge_with_pagination_and_like_sort(self, date, search_text_url, search_text_query, sort_desc, page,
                                                      per_page):
        if sort_desc:
            if search_text_query:
                query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).order_by(desc(QueryUrlsMerge.url)).filter(
                    text("EXISTS (SELECT 1 FROM unnest(queries) AS query WHERE query LIKE :search_text)")
                ).params(search_text='%' + search_text_query.strip() + '%').offset(page).limit(per_page).where(
                    QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format)
                )
            elif search_text_url:
                query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).order_by(desc(QueryUrlsMerge.url)).filter(
                    QueryUrlsMerge.url.like(f"%{search_text_url.strip()}%")).offset(page).limit(
                    per_page).where(QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format))
        else:
            if search_text_query:
                query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).order_by(QueryUrlsMerge.url).filter(
                    text("EXISTS (SELECT 1 FROM unnest(queries) AS query WHERE query LIKE :search_text)")
                ).params(search_text='%' + search_text_query.strip() + '%').offset(page).limit(per_page).where(
                    QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format)
                )
            elif search_text_url:
                query = select(QueryUrlsMerge.url, QueryUrlsMerge.queries).order_by(QueryUrlsMerge.url).filter(
                    QueryUrlsMerge.url.like(f"%{search_text_url.strip()}%")).offset(page).limit(
                    per_page).where(QueryUrlsMerge.date == datetime.strptime(date.split()[0], date_format))
        res = await self.session.execute(query)
        product_row = res.fetchall()
        if len(product_row) != 0:
            return product_row
