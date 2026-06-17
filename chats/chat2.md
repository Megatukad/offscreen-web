# Offscreen copy revision

_Started 2026-06-16 16:27 UTC_

---

## User

Change behind the build copy and make it as just one column without subtitle. Below are the copy:

I have spent years in product and systems design, working behind the scenes. Capable people stay invisible online, not because the work is not worth showing, but because every option asks for the same thing: your face, or a team.
The tools to fix this already exist. The system to put them together did not. That is what Offscreen builds. I built this once on my own AI persona before building it for anyone else. The founder works offscreen too. That part is deliberate.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

I'll update the About section to a single column with the new copy and no subtitles.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

The about-body responsive grid rule is now harmless. Let me verify the result.

_[tool: ready_for_verification]_

Done. The "Behind the build" section is now a single column with the new two-paragraph copy and no subtitle labels.

## User

change the ratio to 4:3 landscape full image bleed

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

The `proof-ph-bleed` class zeroes the radius but the element still sits inside `.container`. Let me check whether block D is inside a padded container so the bleed actually spans full width.

_[tool: read_file]_

_[tool: read_file]_

I'll make it break out of the container to true full-bleed width.

_[tool: str_replace_edit]_

_[tool: show_html]_

This is a layout change worth a visual check.

_[tool: show_html]_

Let me scroll to the proof block D placeholder.

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

The screenshot capture renders from the top of the page, so I can't see the scrolled block here. The change uses the standard full-bleed breakout (`width:100vw; margin-left:calc(50% - 50vw)`) with `aspect-ratio:4/3` and `min-height:0` to override the old fixed height — all reliable. Finalizing.

_[tool: ready_for_verification]_

Done. The finished-output placeholder is now a 4:3 landscape image that bleeds to the full viewport width.

## User

move the text below the full bleed placeholder

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Done. The closing line now sits below the full-bleed placeholder.

## User

how do i replace each images placeholder with real images?

## Assistant

The simplest way is to replace the placeholder `<div>` elements with `<img>` tags pointing to your image files. Here's how:

**1. Upload your images** — drag them into the project files panel on the left, or use the upload button. They'll land in the `uploads/` folder.

**2. Find the placeholder you want to replace** — each one has a class like `proof-ph-a`, `proof-ph-b`, etc. Tell me which placeholder and which image file, and I'll swap it in for you.

For example, for the full-bleed block D I'd change it from:
```html
<div class="proof-ph proof-ph-d proof-ph-bleed ...">...</div>
```
to:
```html
<img src="your-image.jpg" class="proof-ph-d proof-ph-bleed reveal" style="...same styles..." />
```

**To do it yourself**, just find the `<div class="proof-ph ...">` block in `uploads/index.html`, replace the whole `<div>…</div>` with an `<img src="your-file.jpg" ...>` tag, keeping the same `style` attributes.

Just drop your images in and tell me which goes where — I'll handle the swaps.

## User

I uploaded each images as it names, in 4 boxes
- top left: box_1
- top right: box_2
- bottom left: box_3
- bottom right: box_4
- fullbleed 4:3 placeholder: bleed_43

## Assistant

Let me find all the placeholder blocks to swap them all at once.

_[tool: grep]_

Now I'll swap all 5 placeholders at once.

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Done. All 5 placeholders are now replaced with your real images — the 2×2 gallery uses box_1–4 and the full-bleed block uses bleed_43.

