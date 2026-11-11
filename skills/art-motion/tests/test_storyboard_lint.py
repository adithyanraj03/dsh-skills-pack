"""storyboard_lint.py: the example storyboard in the template must go green; a "bullet wall" storyboard must go red with the right reasons. Standard library only, runs in CI."""
import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "storyboard_lint.py"
TEMPLATE = ROOT / "references" / "storyboard-template.md"
spec = importlib.util.spec_from_file_location("storyboard_lint", SCRIPT)
SL = importlib.util.module_from_spec(spec)
spec.loader.exec_module(SL)

# One whiteboard clip carrying the whole film: title open, bullets appearing one by one, a shot of over ten seconds, one clip for 60 s.
WALL = """# Storyboard

| Time | Object | Action | Camera | On-screen text | How |
|---|---|---|---|---|---|
| 0–5 | title | appears | hold | why does this happen let us take a closer look | y3 clip whiteboard.json |
| 5–20 | bullet list | bullets appear one by one | hold | the first reason is this | y3 clip whiteboard.json |
| 20–35 | icons | show | hold | | y3 clip whiteboard.json |
| 35–50 | text | fade in | hold | second point | y3 clip whiteboard.json |
| 50–60 | summary on the whiteboard | appear one by one | hold | remember these three points | y3 clip whiteboard.json |
"""


def tags(res, level):
    out = {t for r in res["rows"] for lv, t, *_ in r["issues"] if lv == level}
    return out | {t for lv, t, *_ in res["table"] if lv == level}


class TemplateExample(unittest.TestCase):
    def test_example_is_green(self):
        res = SL.lint(TEMPLATE.read_text(encoding="utf-8"))
        self.assertNotIn("error", res)
        self.assertEqual(res["verdict"], SL.GREEN, "\n".join(SL.report(res)))
        self.assertGreaterEqual(len(res["rows"]), 10)
        self.assertGreaterEqual(res["total"], 45)

    def test_blank_template_in_code_block_is_skipped(self):
        # The template's blank table sits in a code block; lint only takes the example table.
        res = SL.lint(TEMPLATE.read_text(encoding="utf-8"))
        self.assertTrue(res["rows"][0]["obj"].startswith("Xiaoman"))

    def test_cli_exit_zero(self):
        p = subprocess.run([sys.executable, str(SCRIPT), str(TEMPLATE)], capture_output=True, text=True, encoding="utf-8", errors="replace")
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        self.assertIn("GREEN", p.stdout)


class BulletWall(unittest.TestCase):
    def setUp(self):
        self.res = SL.lint(WALL)

    def test_red(self):
        self.assertEqual(self.res["verdict"], SL.RED)

    def test_reasons(self):
        red = tags(self.res, SL.RED)
        for t in ("① object", "② action", "③ text", "④ opening", "⑤ text share", "⑥ duration", "how"):
            self.assertIn(t, red, "\n".join(SL.report(self.res)))
        self.assertIn("camera", tags(self.res, SL.YELLOW))   # all holds: ⑦ stays quiet (holds may repeat), the table reports "no camera move"

    def test_points_appearing_is_not_an_action(self):
        r = self.res["rows"][1]
        self.assertTrue(any(t == "② action" for _, t, *_ in r["issues"]))

    def test_one_clip_carrying_the_film(self):
        whats = [w for lv, t, w, _ in self.res["table"] if t == "how"]
        self.assertTrue(any("whiteboard.json" in w and "60" in w for w in whats), whats)
        self.assertIn("⑫ style lock", tags(self.res, SL.RED))

    def test_cli_exit_nonzero(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "storyboard.md"
            f.write_text(WALL, encoding="utf-8")
            p = subprocess.run([sys.executable, str(SCRIPT), str(f)], capture_output=True, text=True, encoding="utf-8", errors="replace")
        self.assertEqual(p.returncode, 1, p.stdout)
        self.assertIn("RED", p.stdout)


class Rules(unittest.TestCase):
    HEAD = "| Time | Object | Action | Camera | On-screen text | How |\n|---|---|---|---|---|---|\n"

    def lint(self, *rows):
        return SL.lint(self.HEAD + "\n".join(rows) + "\n")

    def test_concrete_object_with_text_word_is_not_empty(self):
        self.assertTrue(SL.obj_residue("a cat on the whiteboard"))
        self.assertFalse(SL.obj_residue("three bullet points"))
        self.assertFalse(SL.obj_residue("title and icons on white bg"))

    def test_object_appearing_alone_is_weak(self):
        self.assertFalse(SL.act_residue("spores appear", "spores"))
        self.assertTrue(SL.act_residue("spores drift in through the window crack", "spores"))

    def test_text_length(self):
        self.assertEqual(SL.text_len("starch → sugar"), 2)
        self.assertEqual(SL.text_len("28°C"), 1)
        self.assertEqual(SL.text_len("AI wrote a book"), 4)
        self.assertEqual(SL.text_len("—"), 0)

    def test_durations(self):
        res = self.lint("| 0–3 | a cat | jumps onto the table | hold | | scenes/a.js |",
                        "| 3–10 | that cat | knocks over the cup | fast push | | scenes/a.js |",
                        "| 10–19 | the cup | cracks in two | slam | | material photo |",
                        "| 19–20 | the shards | bounce up | pan | | t3 clip a.json |")
        by = {r["n"]: {(lv, t) for lv, t, *_ in r["issues"]} for r in res["rows"]}
        self.assertIn((SL.YELLOW, "⑥ duration"), by[2])
        self.assertIn((SL.RED, "⑥ duration"), by[3])
        self.assertIn((SL.YELLOW, "⑥ duration"), by[4])

    def test_vertical_bar_fullwidth_and_mmss(self):
        res = SL.lint("｜Time｜Object｜Action｜Camera｜On-screen text｜\n｜---｜---｜---｜---｜---｜\n｜0:00–0:03｜a cat｜jumps onto the table｜fast push｜｜\n")
        self.assertEqual(res["rows"][0]["dur"], 3)

    def test_missing_column(self):
        res = SL.lint("| Time | Object | Action |\n|---|---|---|\n| 0–3 | a cat | jumps |\n")
        self.assertIn("missing columns", res["error"])


class EndingAndEmpty(unittest.TestCase):
    HEAD = Rules.HEAD

    def lint(self, *rows, **kw):
        return SL.lint(self.HEAD + "\n".join(rows) + "\n", **kw)

    BODY = ("| 0–3 | a phone | slides from the desk into the pocket | hold | | scenes/a.js |",
            "| 3–6 | that phone | the screen lights up and dims again | fast push | | material screenshot |")

    def test_last_shot_text_card_is_red(self):
        for last in ("| 6–9 | quote | slams into frame | slam | close to the pocket | t2 clip a.json |",
                     "| 6–9 | big text on yellow | pops up | hold | close to the pocket | t2 clip a.json |",
                     "| 6–9 | that phone | gets tucked back into the pocket | hold | close to the pocket | y5 clip a.json |"):
            res = self.lint(*self.BODY, last)
            self.assertIn((SL.RED, "⑧ ending"), {(lv, t) for lv, t, *_ in res["rows"][-1]["issues"]}, last)

    def test_last_shot_on_the_object_passes(self):
        res = self.lint(*self.BODY, "| 6–9 | that phone | gets tucked into the pocket as the camera pulls back to reveal the room | pan | close to the pocket | scenes/b.js |")
        self.assertFalse(any(t == "⑧ ending" for r in res["rows"] for _, t, *_ in r["issues"]))

    def test_empty_scene_object_is_red(self):
        for obj in ("empty shot", "flat color background", "black frame", "black screen", "all black", "gradient background", "empty scene", "solid orange background"):
            res = self.lint(*self.BODY, f"| 6–9 | {obj} | slowly brightens | hold | | scenes/b.js |")
            hits = [w for lv, t, w, _ in res["rows"][-1]["issues"] if lv == SL.RED and t == "① object"]
            self.assertTrue(hits and "empty scene" in hits[0], (obj, hits))

    def test_object_on_dark_background_is_fine(self):
        self.assertTrue(SL.obj_residue("a cat on a black screen"))
        self.assertTrue(SL.obj_residue("a phone on a gradient background"))


class ScriptNumbers(unittest.TestCase):
    HEAD = Rules.HEAD
    SCRIPT = "This year it grew sixty percent. After switching to sum() it got fifteen point two times faster; from two thousand twenty five, twelve thousand yuan per person, about sixty percent of people have used it."

    def row_issues(self, text, script=SCRIPT):
        res = SL.lint(self.HEAD + f"| 0–3 | a phone | slides from the desk into the pocket | fast push | {text} | scenes/a.js |\n| 3–6 | that phone | gets tucked back into the pocket | hold | | material screenshot |\n", script=script)
        return [(lv, t, w) for lv, t, w, _ in res["rows"][0]["issues"]], res

    def test_mismatch_is_red(self):
        iss, _ = self.row_issues("up 27%")
        hit = [w for lv, t, w in iss if t == "⑨ numbers"]
        self.assertTrue(hit and "27" in hit[0] and "script" in hit[0], iss)
        self.assertTrue(all(lv == SL.RED for lv, t, _ in iss if t == "⑨ numbers"))

    def test_spelled_out_numbers_in_script_match(self):
        for text in ("up 60%", "faster by 15.2 times", "since 2025", "12K yuan", "60% of people"):
            iss, _ = self.row_issues(text)
            self.assertFalse([t for _, t, _ in iss if t == "⑨ numbers"], (text, iss))

    def test_rounded_speech_matches_precise_screen(self):
        iss, _ = self.row_issues("8.7 times", script="revenue grew to nearly nine times")
        self.assertFalse([t for _, t, _ in iss if t == "⑨ numbers"], iss)
        iss, _ = self.row_issues("15.3 times", script="it got fifteen point two times faster")
        self.assertTrue([t for _, t, _ in iss if t == "⑨ numbers"], iss)

    def test_no_script_skips_and_hints(self):
        iss, res = self.row_issues("up 27%", script=None)
        self.assertFalse([t for _, t, _ in iss if t == "⑨ numbers"])
        self.assertIn("--script", "\n".join(SL.report(res)))

    def test_cli_script(self):
        with tempfile.TemporaryDirectory() as d:
            board = Path(d) / "storyboard.md"
            board.write_text("Style: paper illustration\nPalette: paper\nCharacters: hands only\n\n"
                             "| Time | Object | Action | Camera | On-screen text | How |\n|---|---|---|---|---|---|\n"
                             "| 0–3 | a kitchen thermometer | climbs from 15 to 28 degrees | slow push | 28°C | scenes/a.js |\n"
                             "| 3–6 | mold spores | multiply on the bread crust | pan | | scenes/a.js |\n", encoding="utf-8")
            ok, bad = Path(d) / "ok.txt", Path(d) / "bad.txt"
            ok.write_text("In the kitchen it warms from fifteen to twenty eight degrees and the mold grows fastest.", encoding="utf-8")
            bad.write_text("The kitchen is warm and the mold grows fastest.", encoding="utf-8")
            p = subprocess.run([sys.executable, str(SCRIPT), str(board), "--script", str(ok)], capture_output=True, text=True, encoding="utf-8", errors="replace")
            self.assertEqual(p.returncode, 0, p.stdout)
            p = subprocess.run([sys.executable, str(SCRIPT), "--script", str(bad), str(board)], capture_output=True, text=True, encoding="utf-8", errors="replace")
            self.assertEqual(p.returncode, 1, p.stdout)
            self.assertIn("screen and voiceover disagree", p.stdout)
            self.assertIn("28", p.stdout)


class TagsColumn(unittest.TestCase):
    HEAD = "| Time | Object | Action | Camera | On-screen text | Tags | How |\n|---|---|---|---|---|---|---|\n"

    def test_more_than_three_tags_is_yellow(self):
        res = SL.lint(self.HEAD + "| 0–3 | a phone | slides from the desk into the pocket | fast push | light | fast, cheap, stable, accurate | scenes/a.js |\n"
                                  "| 3–6 | that phone | gets tucked back into the pocket | hold | | fast, cheap, stable | material screenshot |\n")
        self.assertEqual(res["rows"][0]["tags"], 4)
        self.assertIn((SL.YELLOW, "⑩ tags"), {(lv, t) for lv, t, *_ in res["rows"][0]["issues"]})
        self.assertFalse(any(t == "⑩ tags" for _, t, *_ in res["rows"][1]["issues"]))
        self.assertEqual(res["rows"][0]["text"], "light")          # the Tags column is not mistaken for on-screen text

    def test_tag_count(self):
        self.assertEqual(SL.tag_count("fast · cheap · stable · accurate"), 4)
        self.assertEqual(SL.tag_count("Claude Code"), 2)
        self.assertEqual(SL.tag_count("—"), 0)


if __name__ == "__main__":
    unittest.main()


class NumberCardRule(unittest.TestCase):
    def test_middle_number_card_warns(self):
        t = """| Time | Object | Action | Camera | On-screen text | How |
|---|---|---|---|---|---|
| 0–3 | a person and a cup | the person pours hot water into the cup and the wall fogs up | hold | | scenes/a.js |
| 3–6 | big text | big text slams into frame | slam | 60% | y5 clip a.json |
| 6–9 | that cup | the water slowly cools and the fog clears | fast push | | scenes/a.js |
"""
        res = SL.lint(t)
        msgs = [i[1] for r in res["rows"] for i in r["issues"]]
        self.assertIn("⑪ number card", msgs)


class StyleLock(unittest.TestCase):
    """⑫–⑭: one style locked above the table, a palette without blue-purple, characters either a frame lib or no faces; at most 2 clip grammars."""
    HEAD = "| Time | Object | Action | Camera | On-screen text | How |\n|---|---|---|---|---|---|\n"
    LOCK = "Style: paper illustration\nPalette: paper\nCharacters: hands only\n\n"
    ROWS = ["| 0–3 | a cat | jumps onto the table | hold | | scenes/a.js |", "| 3–6 | that cat | knocks over the cup | fast push | | scenes/a.js |"]

    def lint(self, lock, rows=None):
        return SL.lint(lock + self.HEAD + "\n".join(rows or self.ROWS) + "\n")

    def red(self, res):
        return {(t, w) for lv, t, w, _ in res["table"] if lv == SL.RED} | {(t, w) for r in res["rows"] for lv, t, w, _ in r["issues"] if lv == SL.RED}

    def test_lock_ok(self):
        res = self.lint(self.LOCK)
        self.assertNotIn("⑫ style lock", {t for t, _ in self.red(res)}, "\n".join(SL.report(res)))
        self.assertFalse([t for t, _ in self.red(res) if t.startswith(("⑫", "⑬", "⑭"))])

    def test_missing_lock_is_red(self):
        res = self.lint("Style: paper illustration\n\n")
        whats = [w for t, w in self.red(res) if t == "⑫ style lock"]
        self.assertTrue(whats and "Palette" in whats[0] and "Characters" in whats[0], whats)

    def test_blue_purple_palette(self):
        res = self.lint("Style: flat illustration\nPalette: #0E0631 #2A1A6E #F9FCFB\nCharacters: none\n\n")
        self.assertIn("⑬ palette", {t for t, _ in self.red(res)})
        res = self.lint("Style: cyberpunk\nPalette: #2A1A6E #FF3EA5 #0B0B12\nCharacters: none\nBlue-purple OK: the user explicitly asked for cyberpunk purple\n\n")
        self.assertNotIn("⑬ palette", {t for t, _ in self.red(res)})
        res = self.lint("Style: navy flat\nPalette: #0D1B2A #16293D #EEF3F6 #5CC8E0\nCharacters: none\n\n")   # navy hue ≈ 210°, not blue-purple
        self.assertNotIn("⑬ palette", {t for t, _ in self.red(res)})

    def test_code_drawn_character(self):
        res = self.lint("Style: flat illustration\nPalette: paper\nCharacters: code-drawn chibi figures\n\n")
        self.assertIn("⑭ characters", {t for t, _ in self.red(res)})
        rows = ["| 0–3 | a white-cased robot | waves hello | hold | | scenes/a.js |", "| 3–6 | that cat | knocks over the cup | fast push | | scenes/a.js |"]
        self.assertIn("⑭ characters", {t for t, _ in self.red(self.lint(self.LOCK, rows))})
        self.assertNotIn("⑭ characters", {t for t, _ in self.red(self.lint("Style: picture book\nPalette: paper\nCharacters: frame lib characters/xiaoman/\n\n", rows))})
        rows = ["| 0–3 | Xiaoman | tears open the bread bag | hold | | y4 clip shot01.json |", "| 3–6 | that cat | knocks over the cup | fast push | | scenes/a.js |"]
        self.assertIn("⑭ characters", {t for t, _ in self.red(self.lint(self.LOCK, rows))})

    def test_faces_on_objects_warn(self):
        rows = ["| 0–3 | a gold coin with a smiley | bounces into the jar one by one | hold | | scenes/a.js |", "| 3–6 | that cat | knocks over the cup | fast push | | scenes/a.js |"]
        res = self.lint(self.LOCK, rows)
        self.assertIn("⑭ characters", {t for r in res["rows"] for lv, t, *_ in r["issues"] if lv == SL.YELLOW})

    def test_three_grammars_is_collage(self):
        rows = ["| 0–3 | a cat | jumps onto the table | hold | | y2 clip a.json |", "| 3–6 | that cat | knocks over the cup | fast push | | y5 clip b.json |",
                "| 6–9 | the cup | cracks in two | slam | | t3 clip c.json |"]
        self.assertTrue(any(t == "how" and "3 clip grammars" in w for t, w in self.red(self.lint(self.LOCK, rows))))
        self.assertFalse(any(t == "how" for t, _ in self.red(self.lint(self.LOCK, rows[:2]))))


class CameraRhythm(unittest.TestCase):
    """Camera column: pushes must give and take, accents must be few, "hold" may repeat (added after the 2026-10-12 Nobel short: 102 s, ~48 push-ins)."""
    HEAD = Rules.HEAD
    OBJ = ["a cat | jumps onto the table", "that cat | knocks over the cup", "the cup | cracks in two", "the shards | bounce to the floor", "a paw | bats the shards", "the floor | reflects the cat"]

    def lint(self, cams):
        rows = [f"| {3 * i}–{3 * i + 3} | {self.OBJ[i % 6]} | {c} | | scenes/a.js |" for i, c in enumerate(cams)]
        return SL.lint(self.HEAD + "\n".join(rows) + "\n")

    def issues(self, res):
        return {t for r in res["rows"] for _, t, *_ in r["issues"]} | {t for _, t, *_ in res["table"]}

    def test_three_inward_in_a_row(self):
        self.assertIn("⑮ push-ins", self.issues(self.lint(["slow push", "fast push", "slam", "hold", "pull back", "pan"])))
        self.assertNotIn("⑮ push-ins", self.issues(self.lint(["slow push", "pull back", "fast push", "hold", "slow push", "pan"])))

    def test_too_many_accents(self):
        self.assertIn("⑯ accents", self.issues(self.lint(["fast push", "hold", "slam", "pan", "fast push", "pull back"])))
        self.assertNotIn("⑯ accents", self.issues(self.lint(["slow push", "hold", "slam", "pan", "fast push", "pull back"])))

    def test_holds_can_repeat(self):
        self.assertNotIn("⑦ camera", self.issues(self.lint(["hold", "hold", "hold", "slow push", "pull back", "pan"])))
        self.assertIn("⑦ camera", self.issues(self.lint(["fast push", "fast push", "fast push", "pan", "pull back", "hold"])))
        self.assertNotIn("⑦ camera", self.issues(self.lint(["pan", "pan", "pan", "slow push", "pull back", "hold"])))   # panning item to item across the Vox desk

    def test_inward_synonyms(self):
        self.assertIn("⑮ push-ins", self.issues(self.lint(["slow push", "push in", "zoom in", "hold", "pull back", "pan"])))


class FlatStyleCharacters(unittest.TestCase):
    HEAD = StyleLock.HEAD
    ROWS = "| 0–3 | original cartoon character | pushes the door open | hold | | scenes/a.js |\n| 3–6 | a toolbox | gets set on the floor | pan | | scenes/a.js |\n"

    def role_errors(self, style, role, rows=None):
        result = SL.lint(f"Style: {style}\nPalette: paper\nCharacters: {role}\n\n" + self.HEAD + (rows or self.ROWS))
        issues = result["table"] + [issue for row in result["rows"] for issue in row["issues"]]
        return [i for i in issues if i[0] == SL.RED and i[1] == "⑭ characters"]

    def test_explicit_flat_svg_routes(self):
        for style in ("52_south_park South Park style digital cutout", "37_rick_morty Rick & Morty style flat cartoon"):
            with self.subTest(style=style):
                self.assertFalse(self.role_errors(style, "original semantic SVG paper-cutout characters"))

    def test_other_styles_and_realistic_roles_still_blocked(self):
        for style, role in (("Renoir", "original semantic SVG characters"),
                            ("52_south_park_extra", "original semantic SVG characters"),
                            ("52_south_park", "code-drawn chibi figures"),
                            ("52_south_park", "original semantic SVG realistic live-action person")):
            with self.subTest(style=style, role=role):
                self.assertTrue(self.role_errors(style, role))

    def test_y4_still_requires_frames(self):
        rows = self.ROWS.replace("scenes/a.js", "y4 clip a.json")
        self.assertTrue(self.role_errors("52_south_park", "original semantic SVG paper-cutout characters", rows))
