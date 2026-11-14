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
