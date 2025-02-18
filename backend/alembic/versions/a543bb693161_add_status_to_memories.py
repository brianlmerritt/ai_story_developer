"""add status to memories

Revision ID: a543bb693161
Revises: a543bb693160
Create Date: 2024-03-19

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a543bb693161'
down_revision: Union[str, None] = 'a543bb693160'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add status column with default value 'draft' to memories table
    op.add_column('memories', sa.Column('status', sa.String(), server_default='draft'))


def downgrade() -> None:
    # Remove status column
    op.drop_column('memories', 'status') 