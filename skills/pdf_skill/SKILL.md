---
name: pdf
description: "Use this skill any time a PDF is the primary input or output. This means any task where the user wants to: extract text, tables, or metadata from a .pdf; split, merge, rotate, crop, reorder, or delete pages; fill in or read an AcroForm; add or remove passwords and permissions; stamp watermarks, headers, page numbers, or signatures; compress or linearise a file; convert pages to images; or generate a new PDF report from data. Trigger especially when the user references a PDF by name or path — even casually (like \"the invoice pdf in downloads\") — and wants something done to it or produced from it. Do NOT trigger when the deliverable is a Word document, a spreadsheet, a slide deck, or an HTML page and the PDF is only an incidental export step."
---

# PDF extraction, manipulation, and generation

| Task | Approach |
|---|---|
| **Extract text** for reading or search | `pdfplumber` (layout-aware) or `pypdf` (fast, rough) |
| **Extract tables** | `pdfplumber` `.extract_tables()` — see gotchas |
| **Split / merge / rotate / reorder** | `pypdf` |
| **Fill or read a form** | `pypdf` `get_fields` / `update_page_form_field_values` |
| **Encrypt / decrypt** | `pypdf` |
| **Generate a new report** | `reportlab` for precise layout; HTML → PDF for anything document-shaped |
| **Page → image** | `pypdfium2` or `pdf2image` (needs poppler) |
| **Quick look at contents** | `markitdown file.pdf` |

> `pypdf` and `pdfplumber` are commonly preinstalled — write the script and import directly. Only if an import fails: `pip install pypdf pdfplumber`.

## Decide first: is this a text PDF or a scan?

This decides everything downstream, and getting it wrong wastes the most time.

```python
import pdfplumber

with pdfplumber.open("in.pdf") as pdf:
    sample = "".join((p.extract_text() or "") for p in pdf.pages[:3])
print(len(sample))
```

Near-zero characters across several pages means the pages are **images** — no text extractor will ever find anything. That needs OCR (`pytesseract` plus a rasteriser), which is a different job with different accuracy expectations. Say so before starting rather than returning empty results.

## Gotchas that cost real time

**`extract_text()` returns `None`, not `""`.** On an image-only or empty page it is `None`, so `"".join(p.extract_text() for p in pages)` raises `TypeError`. Always `or ""`.

**Reading order is not visual order.** Text comes out in the order the content stream draws it. Multi-column layouts interleave. For columns, crop and extract each region:

```python
left = page.crop((0, 0, page.width / 2, page.height)).extract_text()
right = page.crop((page.width / 2, 0, page.width, page.height)).extract_text()
```

**Table extraction needs the right strategy.** The default looks for ruling lines. A table with no borders needs text alignment instead:

```python
page.extract_tables({"vertical_strategy": "text", "horizontal_strategy": "text"})
```

Check the shape of what comes back before trusting it — ragged row lengths mean the strategy is wrong.

**`pypdf` merging drops form fields and outlines by default.** Use `PdfWriter.append()` rather than copying pages one by one when you want bookmarks preserved.

**A "decrypted" file is not decrypted until you write it.** `reader.decrypt(pw)` unlocks the object in memory; you still have to write every page to a new `PdfWriter` to get an unencrypted file.

**Page numbers are zero-based** in `pypdf` and one-based in every conversation with a user. State which you mean in output.

**Rotation is metadata.** `page.rotate(90)` sets `/Rotate`; it does not transform coordinates. Anything you stamp afterwards lands in the pre-rotation frame.

## Common recipes

**Split, merge, reorder**

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("in.pdf")
writer = PdfWriter()
for i in [0, 2, 1]:              # reorder while selecting
    writer.add_page(reader.pages[i])
with open("out.pdf", "wb") as fh:
    writer.write(fh)
```

**Read and fill a form**

```python
reader = PdfReader("form.pdf")
print(reader.get_fields().keys())

writer = PdfWriter(clone_from="form.pdf")
writer.update_page_form_field_values(writer.pages[0], {"full_name": "Ada Lovelace"})
# Without this, many viewers show the values as blank until the field is clicked.
writer.set_need_appearances_writer(True)
with open("filled.pdf", "wb") as fh:
    writer.write(fh)
```

**Stamp a watermark or page numbers**

```python
from pypdf import PdfReader, PdfWriter

stamp = PdfReader("stamp.pdf").pages[0]
writer = PdfWriter(clone_from="in.pdf")
for page in writer.pages:
    page.merge_page(stamp)       # stamp on top; use merge_page(stamp, over=False) for a background
```

**Generate a report** — prefer HTML → PDF when the output is document-shaped (headings, paragraphs, tables). Hand-placing text with `reportlab.canvas` is right only for fixed-coordinate work like labels or certificates.

## Requirements for every PDF you produce

- **Reopen and verify.** Assert the page count, and for a form, read the field values back. A file that writes is not a file that opens correctly elsewhere.
- **Never silently lose pages.** If you drop or skip a page, say which and why.
- **Report extraction quality honestly.** If tables came out ragged, or a page held no text, state it. A confident-looking table that silently dropped a column is worse than a warning.
