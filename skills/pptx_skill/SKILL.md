---
name: pptx
description: "Use this skill any time a PowerPoint presentation is the primary input or output. This means any task where the user wants to: create a new .pptx deck from scratch, from an outline, or from other source material (a report, a spreadsheet, notes); open, read, edit, or fix an existing .pptx or .potx file (rewording slides, restyling, adding or reordering slides, fixing layout, replacing images, updating charts); extract text, speaker notes, or structure out of a deck; or convert a deck to or from another format. Trigger especially when the user references a deck by name or path — even casually (like \"the deck in my downloads\") — and wants something done to it or produced from it. The deliverable must be a presentation file. Do NOT trigger when the primary deliverable is a Word document, a spreadsheet, an HTML page, a PDF report, or a diagram image, even if slides are mentioned in passing."
---

# PPTX creation, editing, and extraction

| Task | Approach |
|---|---|
| **Create** or **edit** slides, shapes, text, tables | `python-pptx` — see gotchas below |
| **Read** text and structure quickly | `markitdown deck.pptx` — one `#` heading per slide, notes included |
| **Start from a template** | open the `.potx`/`.pptx` and add slides from its own layouts — never build a theme by hand |
| **Charts** | `python-pptx` native charts (editable in PowerPoint) — see the chart section |
| **Render to images / PDF** | LibreOffice: `soffice --headless --convert-to pdf deck.pptx` |

> `python-pptx` and `markitdown` are commonly preinstalled — write the script and import directly. Only if the import fails: `pip install python-pptx`.

## The one rule that matters most

**Add slides from a layout, never from a blank canvas.** A deck's look lives in its slide master and layouts. If you place raw textboxes at hand-picked coordinates you get a deck that ignores the theme, breaks the moment someone changes the template, and looks obviously machine-made.

```python
from pptx import Presentation

prs = Presentation("template.pptx")      # or Presentation() for the default theme
layout = prs.slide_layouts[1]            # 1 is usually "Title and Content"
slide = prs.slides.add_slide(layout)
slide.shapes.title.text = "Quarterly results"
slide.placeholders[1].text = "Revenue up 25% year on year"
prs.save("out.pptx")
```

Inspect what a template actually offers before assuming index 1:

```python
for i, layout in enumerate(prs.slide_layouts):
    names = [(p.placeholder_format.idx, p.placeholder_format.type, p.name) for p in layout.placeholders]
    print(i, layout.name, names)
```

## Gotchas that cost real time

**Placeholder indices are not positions.** `slide.placeholders[1]` looks up `idx`, not the second placeholder. After `add_slide`, iterate `slide.placeholders` and read `placeholder_format.idx` rather than guessing.

**An emptied placeholder still shows its prompt text.** A placeholder you never fill renders "Click to add text" in edit view. Either fill it or remove it:

```python
sp = placeholder._element
sp.getparent().remove(sp)
```

**Bullet levels come from paragraphs, not from text.** Writing `"- item"` gives you a literal hyphen. Use one paragraph per bullet and set `level`:

```python
tf = slide.placeholders[1].text_frame
tf.text = "Top level"                     # first paragraph
p = tf.add_paragraph()
p.text = "Sub point"
p.level = 1
```

**Units are EMU.** Always go through the helpers — `Inches(1)`, `Pt(18)`, `Cm(2.5)` — never raw integers.

**Autofit does not recompute.** `python-pptx` cannot measure rendered text, so `MSO_AUTO_SIZE.TEXT_TO_FIT_SHAPE` only takes effect once PowerPoint opens the file. If text must fit, set a sensible font size yourself rather than trusting autofit.

**Pictures need one dimension only.** Passing both `width` and `height` distorts the image; pass one and let the other scale.

**There is no `delete_slide`.** Removing a slide means editing the XML:

```python
xml_slides = prs.slides._sldIdLst
xml_slides.remove(list(xml_slides)[index])
```

Reordering works the same way — move the `sldId` element, not the slide object.

## Charts

Native charts stay editable in PowerPoint, which is almost always what the user wants. Pasting a matplotlib PNG gives a dead image.

```python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
from pptx.util import Inches

data = CategoryChartData()
data.categories = ["Q1", "Q2", "Q3"]
data.add_series("Revenue", (12.1, 14.8, 16.3))

slide.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1), Inches(1.5), Inches(8), Inches(4.5), data
)
```

Use an image only when the chart type is one PowerPoint cannot draw (a heatmap, a network graph). Say so when you do.

## Reading an existing deck

```python
for i, slide in enumerate(prs.slides, 1):
    for shape in slide.shapes:
        if shape.has_text_frame:
            print(i, shape.text_frame.text)
    if slide.has_notes_slide:
        print(i, "NOTES:", slide.notes_slide.notes_text_frame.text)
```

`markitdown deck.pptx` is faster when you only need the words. Use `python-pptx` when you need to know *which shape* holds them, because that is what an edit needs.

## Requirements for every deck you produce

- **Open it and check.** After saving, reopen with `python-pptx` and assert the slide count and that each expected placeholder has text. A file that saves is not a file that reads well.
- **One idea per slide.** If a slide's body exceeds roughly six bullets or forty words, split it.
- **Speaker notes carry the detail** that does not belong on the slide: `slide.notes_slide.notes_text_frame.text = "..."`.
- **Report what you could not do.** If a template lacked a layout you needed, or autofit means the text may overflow, say so plainly rather than letting the user discover it in the meeting.
