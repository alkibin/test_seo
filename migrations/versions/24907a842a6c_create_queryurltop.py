"""create QueryUrlTop

Revision ID: 24907a842a6c
Revises: 5e1281e05d92
Create Date: 2024-07-22 10:49:53.263547

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '24907a842a6c'
down_revision = '5e1281e05d92'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('query_url_top',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('top', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(), nullable=False),
    sa.Column('position', sa.Float(), nullable=False),
    sa.Column('clicks', sa.Float(), nullable=False),
    sa.Column('impression', sa.Float(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('query_url_top')
    # ### end Alembic commands ###