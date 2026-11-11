---
name: docx
description: "Use this skill any time a Word document is the primary input or output. This means any task where the user wants to: create a new .docx from scratch, from an outline, or from other source material; open, read, edit, or fix an existing .docx or .dotx (rewriting sections, restyling, adding tables or images, fixing headings, updating headers and footers); extract text, structure, or comments out of a document; produce a report, letter, contract, or memo as a Word file; or fill a Word template with data. Trigger especially when the user references a document by name or path — even casually (like \"the contract in my downloads\") — and wants something done to it or produced from it. The deliverable must be a Word file. Do NOT trigger when the primary deliverable is a PDF, a spreadsheet, a slide deck, an HTML page, or a Markdown file, even if prose is involved."
---

# DOCX creation, editing, and extraction

| Task | Approach |
|---|---|
| **Create** or **edit** paragraphs, tables, images | `python-docx` — see gotchas below |
| **Read** text and structure quickly | `markitdown doc.docx` — headings, lists and tables as Markdown |
| **Start from a template** | open the `.docx`/`.dotx` and use its own styles — never hand-build a look |
| **Fill a template repeatedly** | `docxtpl` (Jinja syntax inside the document) |
| **Convert to PDF** | LibreOffice: `soffice --headless --convert-to pdf doc.docx` |

> `python-docx` and `markitdown` are commonly preinstalled — write the script and import directly. Only if the import fails: `pip install python-docx`.

## The one rule that matters most

**Use named styles, never manual formatting.** A heading is `document.add_heading(...)` or `style="Heading 1"` — not 16pt bold text. Styles are what make the navigation pane, the table of contents, cross-references, and the user's own template work. Bold text that merely *looks* like a heading breaks all four, silently.

```python
from docx import Document

doc = Document("template.docx")          # or Document() for the default styles
doc.add_heading("Quarterly results", level=1)
doc.add_paragraph("Revenue grew 25% year on year.")
doc.add_paragraph("Margin improved", style="List Bullet")
doc.save("out.docx")
```

Check what a template actually offers before assuming a style exists:

```python
for s in doc.styles:
    print(s.type, s.name)
```

Referencing a style the document does not define raises `KeyError`.

## Gotchas that cost real time

**A paragraph is made of runs, and formatting lives on the run.** `paragraph.text = "..."` destroys all formatting in it. To change wording while keeping formatting, edit `run.text`.

**Find-and-replace breaks across runs.** Word splits a sentence into runs at every formatting change *and* often mid-word after editing. Searching `paragraph.text` finds the match; the characters may live in three runs. For simple cases, join and rewrite the runs:

```python
if old in paragraph.text:
    for run in paragraph.runs[1:]:
        run.text = ""
    paragraph.runs[0].text = paragraph.text.replace(old, new)
```

That flattens formatting in that paragraph — acceptable for plain body text, wrong for anything styled. Say which you did.

**There is no `delete_paragraph`.** Remove the element:

```python
p = paragraph._element
p.getparent().remove(p)
```

**Tables need their style set explicitly** or they come out with no borders: `doc.add_table(rows=1, cols=3, style="Table Grid")`.

**`add_picture` needs one dimension**, like slides — passing both distorts the image.

**A table of contents cannot be generated.** `python-docx` can insert the TOC *field*, but only Word computes the page numbers; it renders empty until someone opens the document and refreshes. Tell the user rather than shipping a blank page.

**Headers and footers are per-section**, and a new section does not inherit unless you ask: `section.header.is_linked_to_previous = True`.

## Reading an existing document

```python
doc = Document("in.docx")
for p in doc.paragraphs:
    if p.text.strip():
        print(p.style.name, "|", p.text)
for t in doc.tables:
    for row in t.rows:
        print([c.text for c in row.cells])
```

`doc.paragraphs` does **not** include text inside tables, headers, footers, or textboxes. If a document looks half-empty, that is why — iterate `doc.tables` and `section.header.paragraphs` too.

## Requirements for every document you produce

- **Reopen and verify.** Assert the heading structure and paragraph count after saving.
- **Heading levels must nest.** No `Heading 3` directly under `Heading 1`.
- **Keep the template's styles** when one was supplied. If you had to add a style because the template lacked it, say so.
- **Report what will not render until opened** — a TOC field, cross-references, or anything else Word computes at load. Otherwise the user sends a document with a blank contents page.
