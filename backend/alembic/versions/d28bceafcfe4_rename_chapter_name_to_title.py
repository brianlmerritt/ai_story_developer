"""rename_chapter_name_to_title

Revision ID: d28bceafcfe4
Revises: 
Create Date: 2025-02-17 21:33:34.063916

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd28bceafcfe4'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Rename column while preserving data
    op.alter_column('chapters', 'name', new_column_name='title', existing_type=sa.String())
    
    # Add sequence column if it doesn't exist
    op.add_column('chapters', sa.Column('sequence', sa.String(), nullable=True))

def downgrade():
    # Remove sequence column
    op.drop_column('chapters', 'sequence')
    # Rename column back
    op.alter_column('chapters', 'title', new_column_name='name', existing_type=sa.String())
