"""add invoice data constraints

Revision ID: 9b2f4c6a1d8e
Revises: fda217f3608a
Create Date: 2026-07-19 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "9b2f4c6a1d8e"
down_revision: Union[str, None] = "fda217f3608a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index(op.f("ix_invoices_invoice_number"), table_name="invoices")
    op.create_index(
        op.f("ix_invoices_invoice_number"),
        "invoices",
        ["invoice_number"],
        unique=False,
    )

    op.create_unique_constraint(
        "uq_invoices_user_invoice_number",
        "invoices",
        ["user_id", "invoice_number"],
    )
    op.create_check_constraint(
        "ck_invoices_amount_non_negative",
        "invoices",
        "amount >= 0",
    )
    op.create_check_constraint(
        "ck_invoices_due_date_after_issued_date",
        "invoices",
        "due_date >= issued_date",
    )
    op.create_check_constraint(
        "ck_invoices_status_valid",
        "invoices",
        "status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')",
    )
    op.create_check_constraint(
        "ck_invoice_items_quantity_positive",
        "invoice_items",
        "quantity > 0",
    )
    op.create_check_constraint(
        "ck_invoice_items_unit_price_non_negative",
        "invoice_items",
        "unit_price >= 0",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_invoice_items_unit_price_non_negative",
        "invoice_items",
        type_="check",
    )
    op.drop_constraint(
        "ck_invoice_items_quantity_positive",
        "invoice_items",
        type_="check",
    )
    op.drop_constraint("ck_invoices_status_valid", "invoices", type_="check")
    op.drop_constraint(
        "ck_invoices_due_date_after_issued_date",
        "invoices",
        type_="check",
    )
    op.drop_constraint("ck_invoices_amount_non_negative", "invoices", type_="check")
    op.drop_constraint(
        "uq_invoices_user_invoice_number",
        "invoices",
        type_="unique",
    )

    op.drop_index(op.f("ix_invoices_invoice_number"), table_name="invoices")
    op.create_index(
        op.f("ix_invoices_invoice_number"),
        "invoices",
        ["invoice_number"],
        unique=True,
    )
