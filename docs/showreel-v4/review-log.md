# Review log: Showreel · Three Acts v4

**Process.** Each round I export the v4 frame from Figma (`export_video`, 1080p / 30 fps) and extract a review package:
- hard‑cut frames (scene > 0.3)
- 4 fps timestamped contact sheets
- individual frames at 4 fps
- 6 fps sheets for every 4 s window

Three fresh reviewer agents then score it 1–10 against Metalab reference frames. They see only the frames, the video and the reference frames, with no brief, spec or process notes.

Pass bar: **every reviewer ≥ 8 overall** (target 9).

| Round | Build | Reviewer | Framing | Motion/easing | Transitions | Rhythm | Cohesion | Feels like Metalab | **Overall** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | r1: 37.3 s, 128.57 BPM, 1280‑wide windows, W/H portals | R1‑a | 4 | 5 | 4 | 4 | 4 | 3 | **4** |
| 1 | | R1‑b | 5 | 6 | 6 | 4 | 6 | 4 | **5** |
| 1 | | R1‑c | 5 | 6 | 6 | 4 | 5 | 4 | **5** |

### Round 1: what the reviewers said, and what changed for round 2

| Raised by | Issue | Fix in r2 |
|---|---|---|
| all 3 | UI too small or illegible (screens ~55–65 % of width); no scale play | Windows enlarged to 1536 × 960 (80 %). Preflight re‑rendered at **2x from the original Figma file** and uploaded. Close‑ups added: KPI row 1.5×, Onvlee numbers 1.5×, DM cards 1.25×, grade panel 1.25×. |
| all 3 | Opener: ~0.8 s black, then a dark dashboard on near‑black, static | Opens on a full‑bleed 1.76× macro of the Halcyon headline and KPIs (crisp at 2x) and pulls back into the window from frame 1. Preflight field changed from ink to ultraviolet `#241B4F` for separation. |
| all 3 | Loop seam had ~1.7–2 s of black | The loop is now a portal: a miniature of frame 0 scales up over Onvlee and lands pixel‑identical on frame 0. Zero black. |
| all 3 | Portal "pill" reveals a garbled crop of the next site, like a rendering bug; plate borders linger | The portal is now a scale‑through of a *complete* miniature world (10 % → 100 %) with a 125 % overscaled plate, so no edge slivers appear while it settles. |
| 2 of 3 | The same portal device used 4× | DFSA → Onvlee now hands off with a 4th navy corner wipe while the phone launches out and the Onvlee window rises in. |
| all 3 | Pink burst = slideshow of small static cards (blank menu, tiny pricing card) | Burst removed. Cards lift, then launch out into the large grade‑tile panel. |
| 2 of 3 | Hard cuts break the language (Leva, Onvlee bursts) | Leva is now a horizontal carousel stepping one card per beat. The Onvlee hard cuts are gone (numbers lift, then the map rises). |
| all 3 | Static holds (Halcyon, Leva hero, green phone) | Every hold now has linear drift; holds shortened. Runtime cut from 37.3 s to 32.2 s for a tighter build. |
| 2 of 3 | Ghosted dissolve under lifted components (Leva letterbox, Onvlee stats) | The window now clears in 1 beat instead of 2. |
| all 3 | Add type and brand beats | **Not actioned.** The brief forbids added typography. |
| 2 | r2: 32.2 s, 1536‑wide windows, scale‑through portals, loop portal | R2‑a | 5 | 5.5 | 4 | 4 | 4.5 | 3.5 | **4.5** |
| 2 | | R2‑b | 5 | 6 | 6 | 4 | 6 | 4 | **5** |
| 2 | | R2‑c | 6 | 6 | 6.5 | 5.5 | 6 | 5.5 | **6** |

### Round 2: what the reviewers said, and what changed for round 3

| Raised by | Issue | Fix in r3 |
|---|---|---|
| all 3 | Ghost or double layers where a window faded under its lifted component (2.4 s, 9.5 s, 27.3 s) | **New owned move, "Focus → Separate".** The window's frame contracts around the region (W/H + counter‑translated content) and scales up, so the rest of the UI is masked, never faded. The region then splits into its real components. No opacity crossfades anywhere. |
| all 3 | Flat rhythm: every project is a ~6 s scroll, no build, no burst | Projects cut to ~3–5 s with one hero idea each. Added an **8‑shot half‑beat montage** (7 frames per shot) before the loop. |
| all 3 | Whip scrolls strobe or read as hard cuts (Leva 14.6 s, Onvlee 26.2 s) | Long scroll flings removed. Leva enters straight on its carousel. Onvlee's hero window launches out and the numbers band rises in. The only scroll left is a 900 px step. |
| 2 of 3 | Headline clipped at the top in the opener; the opener is dark and unreadable | Frame 0 is now a composed window. Focus lands on the goal panel at 1.5× (2x source). Separate restacks the KPI tiles into a 2.2× column. |
| 2 of 3 | Onvlee numbers card left‑heavy; map cropped and static | Re‑cropped symmetrically from a **2x Onvlee render**. The band is shown full‑bleed at 1:1, Focus moves onto the stats, then Separate breaks them into a 2×2 at 1.75×. Map removed. |
| 2 of 3 | Portal or wipe used identically each time | Portals now vary (2.5 / 3 / 2 beats). Wipes come from three different corners, plus a navy wipe expanding from behind the phone as the hand‑off to Onvlee. |
| 1 | DM product grid tiny and static | Focus on the card row, then Separate: three cards launch out while card 2 pops to a 1.6× hero (2x‑crisp from a new **DM render**). |
| 1 | Easing monotony | Added an `ease.pop` token (0.22, 1.12, 0.36, 1; under 4 % overshoot) for hero landings. |
| all 3 | Add type and brand beats | **Not actioned** (brief forbids added type). The KPI tiles and Onvlee stats now act as large "type" moments taken from the work itself. |
| 3 | r3: 30.3 s, Focus → Separate, 2x DM/Onvlee renders, half‑beat montage | R3‑a | 6 | 6.5 | 6 | 5 | 6 | 4 | **5.5** |
| 3 | | R3‑b | 6 | 6 | 6 | 5 | 6 | 5 | **5.5** |
| 3 | | R3‑c | 5 | 6 | 6 | 5 | 6 | 4 | **5** |

### Round 3: what the reviewers said, and what changed for round 4

| Raised by | Issue | Fix in r4 |
|---|---|---|
| 1 | **Lorem ipsum** body copy on three Leva cards (the client's own placeholder) | Cards re‑cropped to photo + title + subtitle only (1028 × 503); no placeholder copy appears anywhere. |
| all 3 | Approval card is a 1.5–2 s dead hold, then the portal appears "from nowhere" | A cursor glides in, **presses Approve** (button depresses), and the DM portal grows out of the button as a pill. |
| all 3 | Recap montage: 8 frozen shots with inconsistent scale, playing like timeline scrubbing | Rebuilt as **one anchored rounded frame**: the "350+" tile opens into it, six shots swap inside it (1 beat each) with a slow push, and the last shot (Halcyon) morphs back into frame 0. The loop seam is pixel‑identical (mean diff 0.27/255). No grid (the brief bans a grid closer). |
| all 3 | Phones too small | DFSA is now **three phones** side by side (75 % of width): the centre one scrolls over the corner wipes, the sides drift in parallax. |
| all 3 | Raw Onvlee numbers band (empty right side, cropped render) plus a stat hold | Band removed. The hero window launches out, and the four stat tiles rise straight into a 2×2 (2x‑crisp). The 350+ tile becomes the montage frame. |
| all 3 | Everything flat; no depth | Tried real 3D (arc, coverflow, tilting montage frame), but **Figma's video export does not render 3D transforms** (verified with a spike). Shipped 2D depth instead: the DM cards fan out with in‑plane rotation and an arc dip before the hero card swings level and forward. |
| 2 of 3 | Opener small and slow | Frame 0 is now the focused goal panel (legible at 1.5×). Separate starts at 0.35 s. |
| 2 of 3 | Carousel too quick to read | Leva steps every 2 beats; cards at 1.3× (70 % width); neighbours rest fully off‑screen. |
| all 3 | Type or brand layer; grid resolve | **Not actioned** (both forbidden by the brief). |
