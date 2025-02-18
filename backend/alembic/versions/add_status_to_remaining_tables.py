"""add status to locations discoveries scenes

Revision ID: a543bb693160
Revises: a543bb693159
Create Date: 2024-03-19

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a543bb693160'
down_revision: Union[str, None] = 'a543bb693159'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add status column with default value 'draft' to all three tables
    op.add_column('locations', sa.Column('status', sa.String(), server_default='draft'))
    op.add_column('discoveries', sa.Column('status', sa.String(), server_default='draft'))
    op.add_column('scenes', sa.Column('status', sa.String(), server_default='draft'))


def downgrade() -> None:
    # Remove status columns
    op.drop_column('locations', 'status')
    op.drop_column('discoveries', 'status')
    op.drop_column('scenes', 'status')