---
name: lit-review
description: "Find and read real related papers (arXiv, Semantic Scholar, Crossref, or the deep-research tool), then write a related-work section or paragraph that cites them accurately and add verified .bib entries. Use when writing or extending related work, positioning a contribution, finding prior work on a topic, or for /lit-review."
---

# lit-review

Related work written from memory cites papers that do not exist or do not say what is claimed. Find, read, then write.

## Steps

1. Define the scope: the paper's contribution in one sentence, the 2-4 themes the related work must cover, the year range, and how many papers per theme (typically 3-8).
2. Start from what the paper already cites: parse its `.bib` so you do not re-add existing entries and you reuse its key format.
3. Search, per theme, with real sources:
   - arXiv API: `http://export.arxiv.org/api/query?search_query=all:<terms>&max_results=20`
   - Semantic Scholar: `https://api.semanticscholar.org/graph/v1/paper/search?query=<terms>&fields=title,year,authors,venue,externalIds,abstract,citationCount`
   - Crossref for published versions and DOIs.
   - For a broad survey, the `deep-research` tool or skill if available (it runs its own workers; keep to one at a time).
   Use the harness's web tool or a small Python `urllib` script. Record every query.
4. Select: prefer the papers most relevant to the contribution, the seminal ones, and recent strong baselines. Note for each: title, year, venue, id (DOI/arXiv), and a one-line summary from its abstract.
5. Read before citing: at least the abstract for background citations; for papers you compare against or build on, read the method and results sections. Note the specific point you will cite it for.
6. Write the text: group by theme, not by paper. For each theme: what the line of work does, the key representatives, their limitation relevant to this paper, and how this paper differs. Do not claim "no prior work" or "first" unless the search supports it, and then soften to "to our knowledge" with the searched scope in mind.
7. Add `.bib` entries built from the fetched records (never from memory), in the project's key and field style. Then run cite-verify and latex-build.
8. Report: the papers added per theme with ids, the queries used, and any theme where the search found little.

## Stop when

- Each theme has its papers, the text is written into the asked file (via latex-edit rules), cite-verify exits clean for the new keys, and the paper builds.

## Rules

- Every cited claim about another paper must be traceable to text you read from that paper in this session.
- Do not pad the bibliography. Cite what the argument needs.
- Respect API limits: one request at a time with short pauses; no parallel scraping.
