# Episode 21 — Snapshottest & doctest: Freeze Your Outputs, Make Your Docs Talk Back

If your tests feel like they’re writing a novel about your code’s feelings, Snapshottest and doctest are here to say, “nah—show me the receipts.” One captures output as a snapshot you can diff like a photo album; the other turns your docstrings into executable, truth-or-dare examples. Together, they’re the low-friction duo that keeps your code and docs honest without demanding a blood oath of boilerplate.

**What are they?**

* **Snapshottest** is a Python library that stores expected results in snapshot files and compares future runs against them. It plugs into [pytest](https://medium.com/stackademic/pytest-the-pythonic-swiss-army-knife-bd11bc95dcc9), `unittest`, and even [Django](https://medium.com/@DaveLumAI/django-the-web-framework-that-runs-on-batteries-and-humor-f8acaef0fa6b); the official page has quick examples and the `--snapshot-update` flow at the [PyPI project page](https://pypi.org/project/snapshottest/) and the [GitHub repo](https://github.com/syrusakbary/snapshottest/).
* **doctest** is part of the Python standard library. It scans docstrings for interactive `>>>` sessions and executes them to verify your documentation still matches reality; see the official docs at [docs.python.org/3/library/doctest.html](https://docs.python.org/3/library/doctest.html).

**Are they still relevant?**
Yes. Snapshot testing is thriving in Python—modern teams often prefer the `pytest`-native [Syrupy plugin](https://github.com/syrupy-project/syrupy) for more features, but Snapshottest still works, especially in legacy projects or mixed `unittest`/Django stacks. Doctest remains a staple for documentation-driven projects and scientific Python teams; it integrates nicely with [pytest’s doctest runner](https://docs.pytest.org/en/stable/how-to/doctest.html) and the [Sphinx doctest extension](https://www.sphinx-doc.org/en/master/usage/extensions/doctest.html).

**What are they used for?**

* **Snapshottest:** golden-file style checks of structured outputs (JSON responses, rendered templates, configuration dumps) where “did the overall output change?” matters more than “is field #37 exactly 5?”
* **doctest:** examples in your docstrings that double as tests—perfect for libraries where usage snippets must never lie (NumPy’s docs famously use doctest-style examples; see their note on running doctests in the [NumPy dev docs](https://numpy.org/devdocs/reference/testing.html)).

**Strengths & weaknesses (pros/cons):**

* **Snapshottest**

  * ✅ Fast to write; excellent for broad “shape” regressions
  * ✅ Human-readable diffs; easy update flow (`--snapshot-update`)
  * ⚠️ Can ossify bugs if you “bless” a wrong snapshot
  * ⚠️ Not great with non-determinism (timestamps, randomized order) unless you normalize/ignore fields
* **doctest**

  * ✅ Makes docs executable; prevents bit-rot
  * ✅ Zero extra dependency; ships with Python
  * ⚠️ Brittle about whitespace/formatting (tune with [optionflags](https://docs.pytest.org/en/stable/how-to/doctest.html))
  * ⚠️ Scales poorly for complex scenarios; better as “executable examples” than full test suites

**Alternatives & cousins:**

* **Syrupy** (pytest snapshot plugin with modern ergonomics and serializers): [github.com/syrupy-project/syrupy](https://github.com/syrupy-project/syrupy)
* **ApprovalTests for Python** (assert by human-approved “golden” outputs): [approvaltests.com](https://approvaltests.com/)
* **xdoctest** (AST-based re-implementation of doctest with better parsing): [xdoctest.readthedocs.io](https://xdoctest.readthedocs.io/)
* **nbval** / **pytest-notebook** for validating Jupyter notebooks like snapshots of cell outputs: [nbval docs](https://nbval.readthedocs.io/) and [pytest-notebook](https://pytest-notebook.readthedocs.io/)

**Popularity—up or down? When was it hottest?**
Doctest enjoys steady, “evergreen” usage in library docs and teaching materials. Snapshot testing has grown with the `pytest` ecosystem; projects increasingly pick Syrupy for its clean `assert actual == snapshot` style and up-to-date maintenance, while Snapshottest remains common in older or Django-heavy codebases.

**History & “who invented it?”**
Doctest was contributed to Python by **Tim Peters** in the late ’90s and included in Python 2.1—see the historical note and author credit in early releases and Python’s docs: [doctest docs](https://docs.python.org/3/library/doctest.html). Python snapshot testing draws inspiration from Jest’s approach on the JS side; Snapshottest’s readme directly cites that lineage: [snapshottest on GitHub](https://github.com/syrusakbary/snapshottest).

**What tech stacks do they work with?**

* **Snapshottest:** Python 3.x, `pytest` or `unittest`, Django test runner support.
* **doctest:** any Python 3.x project; often run via `pytest --doctest-modules` or `sphinx -b doctest` during docs builds.

**Do they play well with AI?**

* For LLM-heavy code, raw snapshot tests can flake—model outputs vary subtly. Use **deterministic prompts**, fixed seeds, response *schemas* (validate JSON shape), or compare normalized fields. Consider **ApprovalTests** for reviewer-in-the-loop workflows, or property-based checks with **Hypothesis** when you care about invariants over exact text: [Hypothesis on PyPI](https://pypi.org/project/hypothesis/).

**Tools that pair nicely:**
`black` + `isort` (clean diffs), `pytest-xdist` (speed), `rich` or `pytest`’s diff options (nicer assertions), Sphinx’s doctest builder for CI ([docs](https://www.sphinx-doc.org/en/master/usage/extensions/doctest.html)).

**Any fun facts?**

* You can run doctests straight from `pytest` and set forgiving flags for whitespace or exception detail ([how-to](https://docs.pytest.org/en/stable/how-to/doctest.html)).
* Want to test notebooks like snapshots? `nbval` treats each cell as a test and compares stored vs. fresh outputs ([nbval](https://nbval.readthedocs.io/)).
* If you’re looking for a cultural “art” moment for testing, the closest thing is humor: xkcd has several testing/automation classics like “[Automation](https://xkcd.com/1319/)” and “[Tests](https://xkcd.com/1151/).”

---

## A tiny example you can steal

**doctest in a docstring (collected by pytest or Sphinx):**

```python
# mytext.py
import re

def slugify(s: str) -> str:
    """Turn a string into a URL-friendly slug.

    Examples:
    >>> slugify("Hello, World!")
    'hello-world'
    >>> slugify("Spaces   and dashes?!")
    'spaces-and-dashes'
    """
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-{2,}", "-", s).strip("-")
```

Run with:

```bash
pytest --doctest-modules
# or in Sphinx:
# sphinx-build -b doctest docs/ _build/doctest
```

**Snapshottest with pytest (JSON-ish output):**

```python
# test_api.py
import json
from snapshottest import Snapshot

def render_profile():
    return {"name": "Ada", "roles": ["admin", "editor"], "active": True}

def test_profile_snapshot(snapshot: Snapshot):
    data = render_profile()
    # normalize ordering/volatile fields here if needed
    snapshot.assert_match(json.dumps(data, sort_keys=True, indent=2))
```

First run will fail if no snapshot exists; generate/update with:

```bash
pytest --snapshot-update
```

---

## Should you use these?

* Use **doctest** when your library’s examples are part of the contract. It’s perfect for small, truthful snippets that double as tests.
* Use **snapshot testing** when you care about the *whole output* staying stable—API responses, rendered HTML, config dumps. Reach for **Syrupy** on new projects; keep **Snapshottest** if it’s already wired into your stack and doing the job.

---

## Similar to anything else?

* Golden-file tests in general
* UI screenshot testing (same idea; different medium)
* Notebook validators like **nbval** feel like doctest for `.ipynb`

---

## Companies/projects using these ideas a lot

Open-source projects with rigorous docs—**NumPy**, **pandas**, **Matplotlib**—lean on doctest-style examples and Sphinx doctest builders to keep examples honest (see NumPy’s note on doctests in their [testing guide](https://numpy.org/devdocs/reference/testing.html) and pandas’ doctest-aware [docstring guide](https://pandas.pydata.org/docs/development/contributing_docstring.html)). Many web and data teams snapshot API payloads in CI via Snapshottest/Syrupy or ApprovalTests, especially around backward-compatibility guarantees.

---

## Quick checklist before you adopt

* Normalize non-deterministic fields (timestamps, UUIDs) before snapshotting.
* Store snapshots alongside tests; treat them like code.
* In doctest, set pragmatic flags (e.g., `NORMALIZE_WHITESPACE`) when real-world output is messy.
* Add a docs test job in CI (`sphinx -b doctest` or `pytest --doctest-modules`).
* Consider **property-based tests** (Hypothesis) for behaviors that snapshots can’t capture.

---

**Your turn:** What’s the weirdest “it broke and only the snapshot noticed” story you’ve got? Drop it in the comments. If you’re into this mix of code, art, and practical testing, follow along at [lumaiere.com](https://lumaiere.com/) and say hi.

---

**[Art Prompt (Renaissance)](https://lumaiere.com/?gallery=renaissance):**
A luminous coastal tableau at dawn: a central figure stands poised near the surf, hair and fabric billowing in a salt-kissed breeze. Pale shell-pinks, seafoam greens, and sun-washed ochres dominate a soft, pastel palette. The composition is balanced and linear, with graceful contours and delicate, rhythmic drapery. Faces are serene, idealized, and illuminated by a gentle, diffused glow. The sea shimmers like hammered metal; nearby attendants reach with elegant, elongated hands, offering a patterned cloak. The atmosphere is tranquil yet ceremonial, celebrating beauty, rebirth, and the hush before day fully arrives—everything rendered with meticulous edges, fine hatching, and lyrical, flowing lines.

**[Video Prompt](https://www.tiktok.com/@davelumai/video/7553457417497971998):**
Slow dolly from the shoreline toward the central figure as early light ripples across the water; fabric and hair move in looping, graceful cycles. Subtle particle spray catches the sun; cut to a lateral glide revealing attendants stepping in with the ornate cloak. Alternate close-ups of hands and drapery textures with wide shots of the pastel sky. Add gentle wave-synced camera sway; end on a lingering push-in as the breeze lifts the cloak and the color grade warms slightly from pearl to gold.

**Songs to score the video:**

* Shelter – Porter Robinson & Madeon
* Alone in Kyoto – Air

---

If this helped, **follow** and tell me which camp you’re in—team “docs that run” or team “snapshots don’t lie.”
