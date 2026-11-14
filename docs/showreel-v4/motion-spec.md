# Motion spec: "Frames on fields" (Showreel · Three Acts, v4)

One system, distilled from Metalab's 2022 reel and 2024 Frames language (see `reference-breakdown.md`). Every rule below is used in the edit, and nothing outside it is.

## Rules

1. **Everything lives in a frame on a field.** Each project owns one flat field colour taken from its own brand. UI only ever appears inside a rounded frame floating on that field: a window, a phone, or a single lifted component. Full‑bleed exists only for the instant a frame becomes the next field.
2. **Projects change only through a portal.** The next project's field opens as a frame from the centre of the screen and expands until it *is* the screen (radius 32 → 0). Meanwhile the old world pushes towards camera (scale 1 → 1.1). No crossfades, no slides between projects.
3. **Lift, don't crop.** A component is pulled out of the live page at its true bounds, from its true position, and settles larger (≤ 1.3× because the sources are 1×). The page behind recedes and dissolves. A settled frame always shows whole components, whole windows, or a page viewport resting on a section boundary.
4. **The anchor holds while the world moves.** Inside a project, one object stays put while its content or its field changes: phone content scrolls while circular field wipes sweep behind it, or the burst content cuts in place.
5. **Momentum through the cut.** Exits accelerate (launch) and are fast (1 beat). Entrances decelerate (settle) over 2 beats. Chained moves overlap, so no move starts from rest just after another stops.
6. **Everything starts on the beat grid.** Moves start on a beat (staggers on ¼ beats). Bursts cut once per beat. Holds last at least 1 beat and drift slowly so nothing is ever frozen.
7. **Quiet depth.** One shadow token on light fields; a hairline edge on dark fields. No glows, no bounce, no added type, no added logos.
8. **The loop is the frame.** The reel opens on a window opening out of the ink field and ends by collapsing the last world back into the same ink. The first and last frames are identical.

## Tempo and timing tokens

- **Tempo:** 128.57 BPM, so one beat = **14 frames @ 30 fps = 0.4667 s** (the 2024 reel's cut grid). One bar = 4 beats = 1.867 s.
- **Length:** 80 beats = 20 bars = **37.33 s**.

| Token | Beats | Seconds | Use |
|---|---|---|---|
| `t.cut` | 1 | 0.467 | burst cut interval; exits |
| `t.enter` | 2 | 0.933 | component entrances, lifts, scroll steps, field wipes |
| `t.portal` | 3 | 1.400 | project handoff, open, close |
| `t.stagger` | ¼ | 0.117 | between siblings in a cascade |
| `t.hold` | ≥ 1 | ≥ 0.467 | settled states (always with drift) |

## Easing tokens (three curves only)

| Token | cubic‑bezier | From the reference | Used for |
|---|---|---|---|
| `ease.glide` | **(0.80, 0.05, 0.15, 1.00)** | 2024 frames and tile moves, fits of (0.77–0.82, 0.04–0.06, 0.12–0.21, 0.96–1.14) | portals, lifts, scroll steps, field wipes, recedes |
| `ease.settle` | **(0.16, 1.00, 0.30, 1.00)** | decel out of momentum cuts, speed peak at 9–14 % | entrances, the in‑beat settle of burst content |
| `ease.launch` | **(0.70, 0.00, 0.84, 0.00)** | accel into momentum cuts, speed peak at 80–90 % | exits |

Slow drift during holds is `LINEAR` and ≤ 3 % scale or ≤ 30 px per hold. Visibility switches use `HOLD` (hard cuts).

## Transition vocabulary

| Transition | Definition | Uses |
|---|---|---|
| **Open** | the window grows from a point to full size (W/H + radius), its content centred and revealed through the opening | 1 (reel start) |
| **Portal** | the next field opens from the centre as a rounded frame and expands to full bleed in `t.portal` / `glide`; the old world scales 1 → 1.1 underneath | 4 (one per project change) |
| **Scroll step** | page or phone content moves one section in `t.enter` / `glide` while the window breathes (scale 1 → 0.975 → 1), then rests on a section boundary | 5 |
| **Lift** | component(s) rise from their in‑page position to centre at ≤ 1.3×, staggered ¼ beat, `glide`; the window recedes (0.92) and dissolves | 4 |
| **Field wipe** | a circle in the next colour grows from the bottom‑right corner behind the anchor, synced to a scroll step | 3 |
| **Burst** | whole components hard‑cut in place on every beat; each lands 4 % large and settles to 1 within the beat | 3 runs (DM, Leva, Onvlee) |
| **Launch‑out** | settled components exit upward in `t.cut` / `launch`, staggered ¼ beat; the next object is already entering | 2 |
| **Close** | the last field collapses to a point (the reverse of Open) | 1 (reel end, loop point) |

Not used: crossfades between content, slides between projects, pixel or stylised wipes, 3D flips, springs or bounce, any added typography.

## Framing rulebook

| Object | On‑screen size | Notes |
|---|---|---|
| Desktop window | 1280 × 800 (Onvlee 1280 × 864), centred | 67 % of frame width; 320 px side margins; radius 20; source at 0.889× (Onvlee 0.667×) |
| Phone | 367 × 793 (390 × 844 at 0.94×), centred | 73 % of frame height; radius 44; no bezel |
| Lifted component | 0.9–1.3× source | at least 120 px from any edge; complete component only |
| Component row | n × card at 1.15×, 28 px gaps | centred; the row spans ≤ 84 % of width |
| Field | 1920 × 1080 flat colour | from the project's brand |

**Scroll rests** (source px from the top of the page). A rest is valid only if its top and bottom edges fall in whitespace or on a section boundary:
- DM Home: 0, then 900
- Leva Home: 0, then 2440
- DFSA mobile: 0, 1300, 3330, 5240
- Onvlee Home: 0, then 3520

**Depth tokens**
- Light fields: drop shadow 0 / 40 / 100 px, black 22 %.
- Dark fields: no shadow, 1 px inside stroke at white 8 %.
- Portal frame: drop shadow 0 / 30 / 120 px, black 40 %. It sits off‑canvas once the portal is full‑bleed.

## Palette (sampled from each project)

| Project | Field | Source |
|---|---|---|
| Preflight (Act I) | Ink `#0E0F12` | app chrome |
| Designing Minds (Act II) | Pink `#E65A95` | site banner and CTA |
| Leva Foundation (Act II) | Deep teal `#0B3C49` | darkened from the card teal `#137D97` |
| DriedFruitSA (Act III) | Cream `#F1ECE4` → Olive `#3A3B1F` → Orange `#FC7C0D` → Green `#78A54D` | the colour of each phone card it frames |
| Onvlee (Act III) | Navy `#06101F` | site dark sections |

## Storyboard (beats; t = beat × 0.4667 s)

| Beats | Time | Act / shot | Moves |
|---|---|---|---|
| 0–0.5 | 0.00–0.23 | Ink (loop point) | — |
| 0.5–3.5 | 0.23–1.63 | **I · Preflight**: Open | the Halcyon window opens from a point |
| 3.5–7 | 1.63–3.27 | window hold | drift 1 → 1.03 |
| 7–9 | 3.27–4.20 | Lift | the KPI strip lifts out to 1.1× at the top; window recedes |
| 8.5–11 | 3.97–5.13 | Cascade | approval card, then composer, settle in below (agent panel) |
| 13–14 | 6.07–6.53 | Launch‑out | the panel exits upward, staggered |
| 13.75–15.75 | 6.42–7.35 | Enter | the document enters from below and settles |
| 16–19 | 7.47–8.87 | **Portal → II · Designing Minds** | pink field opens; Preflight pushes in |
| 20–22 | 9.33–10.27 | Scroll step | hero → Featured products |
| 24–26 | 11.20–12.13 | Lift | 4 product cards lift into a row at 1.15× |
| 27–28 | 12.60–13.07 | Launch‑out | the cards exit upward |
| 28 / 29 / 30 / 31 | 13.07–14.47 | Burst | grade tiles → full‑year bundle → product image → mobile menu (phone) |
| 34–37 | 15.87–17.27 | **Portal → Leva** | teal field opens on the Leva hero window |
| 39–41 | 18.20–19.13 | Scroll step | hero → pathway card |
| 41–43 | 19.13–20.07 | Lift | the Tangible card lifts out to 1.0× |
| 44 / 45 / 46 / 47 | 20.53–22.40 | Burst | Red Band → Work for a Living → ReTrade → pathways panel |
| 48–51 | 22.40–23.80 | **Portal → III · DriedFruitSA** | cream field opens on the phone |
| 52–54 / 55–57 / 58–60 | 24.27–28.00 | Scroll steps + field wipes | Our Range (olive), Saves Time (orange), Take Anywhere (green) |
| 63–66 | 29.40–30.80 | **Portal → Onvlee** | navy field opens on the Onvlee window |
| 67–69 | 31.27–32.20 | Scroll step | hero → products and numbers |
| 70–72 | 32.67–33.60 | Lift | the numbers band lifts out to 1.2× |
| 72 / 73 / 74 | 33.60–35.00 | Burst | map → collage → offer cards |
| 75.5–79.5 | 35.23–37.10 | **Close** | the navy world collapses back to ink |
| 79.5–80 | 37.10–37.33 | Ink | the loop seam (identical to beat 0) |

Acts: **I** Preflight (product / AI tooling, dark) · **II** Designing Minds + Leva (people / education, colour) · **III** DriedFruitSA + Onvlee (brand / industry, bold).
