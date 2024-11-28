"""replace_zero_with_null_and_create_views

Revision ID: bc86504b8f87
Revises: d89d3d74cdda
Create Date: 2024-10-28 18:04:20.398709

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc86504b8f87'
down_revision = 'd89d3d74cdda'
branch_labels = None
depends_on = None


def upgrade() -> None:

    # Изменяем столбцы, делая их nullable=True
    with op.batch_alter_table("metrics") as batch_op:
        batch_op.alter_column('demand', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('position', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('ctr', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('clicks', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('impression', existing_type=sa.Float(), nullable=True)

    with op.batch_alter_table("metrics_query") as batch_op:
        batch_op.alter_column('demand', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('position', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('ctr', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('clicks', existing_type=sa.Float(), nullable=True)
        batch_op.alter_column('impression', existing_type=sa.Float(), nullable=True)


    # Обновляем записи: заменяем 0 на NULL для всех необходимых столбцов
    op.execute("""
        UPDATE metrics
        SET 
            demand = NULLIF(demand, 0),
            position = NULLIF(position, 0),
            ctr = NULLIF(ctr, 0),
            clicks = NULLIF(clicks, 0),
            impression = NULLIF(impression, 0)
    """)

    op.execute("""
        UPDATE metrics_query
        SET 
            demand = NULLIF(demand, 0),
            position = NULLIF(position, 0),
            ctr = NULLIF(ctr, 0),
            clicks = NULLIF(clicks, 0),
            impression = NULLIF(impression, 0)
    """)
    
    # Создаем представление metrics_view
    op.execute("""
        CREATE VIEW metrics_view AS
        SELECT 
            id,
            url_id,
            date,
            COALESCE(demand, 0) AS demand,
            COALESCE(position, 0) AS position,
            COALESCE(ctr, 0) AS ctr,
            COALESCE(clicks, 0) AS clicks,
            COALESCE(impression, 0) AS impression
        FROM metrics
    """)

    op.execute("""
        CREATE VIEW metrics_query_view AS
        SELECT 
            id,
            query_id,
            date,
            COALESCE(demand, 0) AS demand,
            COALESCE(position, 0) AS position,
            COALESCE(ctr, 0) AS ctr,
            COALESCE(clicks, 0) AS clicks,
            COALESCE(impression, 0) AS impression
        FROM metrics_query
    """)


def downgrade() -> None:
    # Удаляем представления metrics_view и metrics_query_view
    op.execute("DROP VIEW IF EXISTS metrics_view")
    op.execute("DROP VIEW IF EXISTS metrics_query_view")

    # Возвращаем значения NULL к 0 для поддержания целостности данных
    op.execute("""
        UPDATE metrics
        SET 
            demand = COALESCE(demand, 0),
            position = COALESCE(position, 0),
            ctr = COALESCE(ctr, 0),
            clicks = COALESCE(clicks, 0),
            impression = COALESCE(impression, 0)
    """)

    op.execute("""
        UPDATE metrics_query
        SET 
            demand = COALESCE(demand, 0),
            position = COALESCE(position, 0),
            ctr = COALESCE(ctr, 0),
            clicks = COALESCE(clicks, 0),
            impression = COALESCE(impression, 0)
    """)

    # Возвращаем изменение nullable на False
    with op.batch_alter_table("metrics") as batch_op:
        batch_op.alter_column('demand', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('position', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('ctr', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('clicks', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('impression', existing_type=sa.Float(), nullable=False)

    with op.batch_alter_table("metrics_query") as batch_op:
        batch_op.alter_column('demand', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('position', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('ctr', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('clicks', existing_type=sa.Float(), nullable=False)
        batch_op.alter_column('impression', existing_type=sa.Float(), nullable=False)

    
