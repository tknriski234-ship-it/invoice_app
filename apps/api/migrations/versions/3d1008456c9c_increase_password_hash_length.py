"""increase password_hash length

Revision ID: 3d1008456c9c
Revises: fcf927714b29
Create Date: 2026-04-01 01:35:06.833664

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d1008456c9c'
down_revision: Union[str, None] = 'fcf927714b29'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "password_hash",
        type_=sa.String(length=512),
        existing_type=sa.String(length=255),
        existing_nullable=False
    )
def downgrade() -> None:
    op.alter_column(
        "users",
        "password_hash",
        type_=sa.String(length=255),
        existing_type=sa.String(length=512),
        existing_nullable=False
    )