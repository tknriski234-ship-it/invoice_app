from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO


def generate_invoice_pdf(invoice):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4
    y = height - 50

    # 🧾 HEADER
    p.setFont("Helvetica-Bold", 18)
    p.drawString(50, y, "INVOICE")

    y -= 30

    p.setFont("Helvetica", 10)
    p.drawString(50, y, f"Invoice No: {invoice.invoice_number}")
    y -= 15
    p.drawString(50, y, f"Title: {invoice.title}")
    y -= 15
    p.drawString(50, y, f"Issued: {invoice.issued_date}")
    y -= 15
    p.drawString(50, y, f"Due: {invoice.due_date}")

    y -= 30

    # 📦 TABLE HEADER
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y, "Item")
    p.drawString(250, y, "Qty")
    p.drawString(300, y, "Price")
    p.drawString(400, y, "Subtotal")

    y -= 15
    p.line(50, y, 550, y)

    y -= 15

    # 📦 ITEMS
    p.setFont("Helvetica", 10)

    for item in invoice.items:
        if y < 50:  # page break
            p.showPage()
            p.setFont("Helvetica", 10)
            y = height - 50

        p.drawString(50, y, item.title[:30])
        p.drawString(250, y, str(item.quantity))
        p.drawString(300, y, f"{item.unit_price}")
        p.drawString(400, y, f"{item.subtotal}")

        y -= 20

    y -= 10
    p.line(50, y, 550, y)

    y -= 20

    # 💰 TOTAL
    p.setFont("Helvetica-Bold", 12)
    p.drawString(350, y, "Total:")
    p.drawString(420, y, f"{invoice.amount}")

    # 🧾 FOOTER
    y -= 40
    p.setFont("Helvetica", 8)
    p.drawString(50, y, "Thank you for your business.")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer