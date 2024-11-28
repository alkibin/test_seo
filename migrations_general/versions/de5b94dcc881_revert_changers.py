"""revert_changers

Revision ID: de5b94dcc881
Revises: e5635ab09c12
Create Date: 2024-10-01 20:53:51.248757

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de5b94dcc881'
down_revision: Union[str, None] = '69ca132e5e49'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('config_user_id_fkey', 'config', type_='foreignkey')
    op.drop_column('config', 'user_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('config', sa.Column('user_id', sa.BIGINT(), autoincrement=False, nullable=True))
    op.create_foreign_key('config_user_id_fkey', 'config', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###
