"""auto_generated_migration

Revision ID: 73a3841e4b98
Revises: d28bceafcfe4
Create Date: 2025-02-18 11:14:41.690605

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '73a3841e4b98'
down_revision: Union[str, None] = 'd28bceafcfe4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_chapters_name', table_name='chapters')
    op.create_index(op.f('ix_chapters_title'), 'chapters', ['title'], unique=False)
    op.add_column('memories', sa.Column('title', sa.String(), nullable=True))
    op.add_column('memories', sa.Column('summary', sa.Text(), nullable=True))
    op.add_column('memories', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('memories', sa.Column('key_details_and_quirks', sa.Text(), nullable=True))
    op.create_index(op.f('ix_memories_title'), 'memories', ['title'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_memories_title'), table_name='memories')
    op.drop_column('memories', 'key_details_and_quirks')
    op.drop_column('memories', 'description')
    op.drop_column('memories', 'summary')
    op.drop_column('memories', 'title')
    op.drop_index(op.f('ix_chapters_title'), table_name='chapters')
    op.create_index('ix_chapters_name', 'chapters', ['title'], unique=False)
    # ### end Alembic commands ###
