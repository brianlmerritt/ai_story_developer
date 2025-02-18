"""add status to characters

Revision ID: add_status_to_characters
Revises: # This will be auto-filled by Alembic
Create Date: 2024-03-19

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'add_status_to_characters'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add status column with default value 'draft'
    op.add_column('characters', sa.Column('status', sa.String(), server_default='draft'))


def downgrade() -> None:
    # Remove status column
    op.drop_column('characters', 'status') 