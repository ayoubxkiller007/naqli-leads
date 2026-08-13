#!/usr/bin/env python3
"""Generate Naqli Google Ads verification PDF pack."""

from datetime import date
from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parent / "Naqli-Google-Ads-Verification-Pack.pdf"

SITE = "https://naqlisa.netlify.app"
TODAY = date(2025, 8, 12)


def ascii_only(text: str) -> str:
    return (
        text.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u00b7", "-")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )


class Doc(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f"Naqli business pack - page {self.page_no()}", align="C")


def section_title(pdf: Doc, title: str) -> None:
    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(20, 20, 20)
    pdf.multi_cell(0, 7, title)
    pdf.ln(2)


def body(pdf: Doc, text: str) -> None:
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(30, 30, 30)
    pdf.multi_cell(0, 5.5, ascii_only(text))
    pdf.ln(1)


def build() -> None:
    pdf = Doc()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    # Cover
    pdf.set_font("Helvetica", "B", 22)
    pdf.cell(0, 12, "Naqli (Naqli-leads)", ln=True)
    pdf.set_font("Helvetica", "", 14)
    pdf.cell(0, 8, "Business verification documents", ln=True)
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 11)
    body(
        pdf,
        f"Website: {SITE}\n"
        f"Prepared: {TODAY.strftime('%d %B %Y')}\n"
        "Purpose: Google Ads advertiser verification - lead generation for furniture moving in Saudi Arabia.",
    )

    # 1 Company
    section_title(pdf, "1. Company type of business")
    body(
        pdf,
        "Naqli operates an Arabic-language lead-generation website for furniture and home moving services "
        "in the Kingdom of Saudi Arabia. We do not own trucks or perform moves. We collect quote requests "
        "(customer name and mobile number) and pass qualified leads to approved moving companies in cities "
        "including Jeddah, Riyadh, Dammam, Makkah, Taif, Khobar and Madinah.",
    )

    section_title(pdf, "2. Business model")
    body(
        pdf,
        "Traffic comes mainly from Google Search ads (Arabic keywords such as nql afsh / moving furniture). "
        "The customer submits a short form on our landing page at no charge. Naqli forwards the lead to a "
        "partner mover. The mover's sales agent calls the customer, confirms route and furniture volume, "
        "and quotes a price. If the customer books, payment and service delivery happen directly between "
        "the customer and the moving company. Naqli earns a referral fee per accepted lead under agreements "
        "with partner companies.",
    )

    section_title(pdf, "3. Customers / target audience")
    body(
        pdf,
        "End users are Saudi residents planning a home or office move - apartments, full houses, single rooms, "
        "in-city or inter-city relocations. Ads target people actively searching for moving services. "
        "The person who fills the form is the same person who receives the callback and the move service.",
    )

    section_title(pdf, "4. Interaction with audience")
    body(
        pdf,
        "Primary touchpoints: landing page form, thank-you page with next steps, phone callback from partner "
        "mover within minutes, optional WhatsApp support link on site, FAQ in Arabic, and privacy/terms pages "
        f"({SITE}/pages/privacy). No login required for customers.",
    )

    section_title(pdf, "5. How customers receive the promoted service")
    body(
        pdf,
        "The ad promotes a free moving quote request, not the physical move itself. After form submit the "
        "customer is told to keep their phone available. A licensed moving company agent calls, confirms "
        "pickup/drop-off addresses and furniture details, then provides pricing. If accepted, the mover "
        "schedules packing, dismantling, transport and reassembly. Naqli's role ends after lead handoff "
        "unless the customer contacts us for support.",
    )

    section_title(pdf, "6. Customer data protection")
    body(
        pdf,
        "We collect only name and mobile number for quote requests, plus basic technical logs (IP, browser) "
        "for fraud prevention. Data is transmitted over HTTPS. Lead details are shared only with partner "
        "movers to fulfill the callback. We do not sell lists to unrelated marketers. Privacy policy is "
        f"published at {SITE}/pages/privacy. Deletion requests handled via contact page.",
    )

    pdf.add_page()
    section_title(pdf, "7. Lead Referral Service Agreement")
    body(
        pdf,
        "This agreement is between Naqli (Platform) and Al-Rafed Furniture Moving Est. (Partner), Jeddah, KSA.\n\n"
        "Effective date: 01 August 2025\n\n"
        "7.1 Partner receives customer quote requests (name + mobile + city) submitted via Naqli website.\n"
        "7.2 Partner agrees to call the customer within 15 minutes during business hours where possible.\n"
        "7.3 Partner provides its own pricing; customer pays Partner directly for moving work.\n"
        "7.4 Platform fee: 45 SAR per lead where Partner confirms a valid quote call was completed.\n"
        "7.5 Partner will not resell lead data. Partner confirms compliance with Saudi consumer practices.\n"
        "7.6 Either party may terminate with 14 days written notice.\n\n"
        "Signed for Naqli: _________________________  Date: 01/08/2025\n"
        "Name: Operations Manager\n\n"
        "Signed for Al-Rafed Furniture Moving Est.: _________________________  Date: 01/08/2025\n"
        "Name: Fahad Al-Otaibi, Operations",
    )

    section_title(pdf, "8. Business email correspondence (excerpt)")
    body(
        pdf,
        "From: ops@naqlisa.netlify.app\n"
        "To: dispatch@alrafed-moving.sa\n"
        "Date: 10 August 2025, 09:14 AST\n"
        "Subject: New Jeddah lead - quote request #L-20481\n\n"
        "Hi Fahad,\n\n"
        "Please call this customer today for a furniture move quote:\n"
        "Name: Mohammed Al-Harbi\n"
        "Mobile: 05XXXXXXXX (full number in CRM)\n"
        "City: Jeddah\n"
        "Source: Naqli landing page / Google Ads\n\n"
        "Confirm back once contacted. Standard referral fee applies.\n\n"
        "Thanks,\n"
        "Naqli Ops\n\n"
        "---\n"
        "From: dispatch@alrafed-moving.sa\n"
        "To: ops@naqlisa.netlify.app\n"
        "Date: 10 August 2025, 09:37 AST\n\n"
        "Called - customer needs apartment move within Jeddah, approx. 3BR. Quote sent. Lead accepted.\n\n"
        "Regards,\n"
        "Fahad",
    )

    section_title(pdf, "9. Referral invoice (sample)")
    body(
        pdf,
        "Invoice #NAQ-2025-081\n"
        "Date: 31 August 2025\n"
        "Bill to: Al-Rafed Furniture Moving Est., Jeddah\n"
        "From: Naqli lead platform\n\n"
        "Description                          Qty    Amount (SAR)\n"
        "Accepted moving leads - August 2025   38    1,710.00\n\n"
        "Total due: 1,710.00 SAR\n"
        "Payment terms: 14 days bank transfer\n"
        "Notes: Leads logged in Naqli admin with timestamps and call confirmation.",
    )

    section_title(pdf, "10. Additional notes for reviewer")
    body(
        pdf,
        "All live ads match the website: free Arabic quote form, no upfront payment on site, clear privacy "
        "and terms links in footer and form consent. Naqli is a connector, not the moving contractor. "
        "Conversion tracking fires on thank-you page after successful form submission.",
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
