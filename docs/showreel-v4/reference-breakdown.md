# Reference breakdown: Metalab reels

The two references are both Metalab (metalab.com, the product design agency). I checked the source of each before analysing it.

| | Reel A | Reel B |
|---|---|---|
| Title | "MetaLab's 2022 Showreel" | 2024 rebrand / brand reel |
| Source | Dribbble shot 19784141. The page title reads "MetaLab's 2022 Showreel by Adrien Joulie for MetaLab". Downloaded from Dribbble's CDN (`original` file). | X post by **@metalab**, 28 Feb 2024, caption "New site. New brand. Still making interfaces." (x.com/metalab/status/1762874259179798696), via yt-dlp |
| Spec | 1408×1056 (4:3), 30 fps, 89.1 s, AAC audio | 1920×1080, 30 fps, 60.05 s, AAC audio |
| Supporting | The Awwwards case study for metalab.com, which describes the "Frames → portals" motion language. 24 product loops from metalab.com's own Sanity CDN, used to check framing. | |

Rejected along the way:
- YouTube "metalabs Design Agency Showreel 2022" (channel "Metalabs.global"), a different company.
- vimeo.com/metalab, an unrelated account that hosts Maemo videos.

Method (`ffmpeg` + Python, scripts are in the session scratchpad):
- Hard cuts with `select='gt(scene,0.3)'`.
- 6 fps samples, plus 10 fps zooms on the key transitions.
- Tempo from the audio with `librosa.beat.beat_track`.
- Easing measured, not guessed: Farneback optical flow gives a 90th‑percentile speed per frame. I split it into isolated moves, integrated each into a 0→1 progress curve, and fitted a cubic‑bezier by least squares (RMSE noted).

---

## 1. Tempo and cut rhythm

| | 2022 reel | 2024 reel |
|---|---|---|
| Tempo (audio) | **143.6 BPM**, beat 0.418 s | **129.2 BPM**, beat 0.464 s |
| Hard cuts (scene > 0.3) | 30 | 36 |
| Median shot | 0.45 s (≈ 1 beat) | 0.47 s (= 14 frames @ 30 fps) |
| Shots ≤ 1 beat | 18 / 30 | 25 / 36 |
| Shots > 4 s | 6 (9–47 beats long) | 6 (10–24 beats long) |

**The rhythm is bimodal.**
- **Bursts** are runs of 6–12 hard cuts, one per beat. In 2022: the logo/world montage at 0.8–5.6 s and the client logos at 77–86 s. In 2024: 11.1–16.2 s, 26.3–29.6 s and 48.9–54.1 s. The 2024 burst cuts land exactly every 14 frames, so the editor cut on a whole‑frame beat grid.
- **Long takes** run 5–20 s with no cuts at all. Inside them the energy comes from continuous "camera" and component choreography, and every move starts on a beat.
- **Arc**: brand opener → long product takes broken up by short bursts → logo/brand closer. (We drop the opener and closer cards: no type, no grid.)

## 2. Shot by shot

### 2022 reel (Adrien Joulie)

| t (s) | Shot | Framing | Motion / transition |
|---|---|---|---|
| 0.0–0.8 | M star on black | centred mark, ~8 % of height | hold |
| 0.8–5.6 | 12 "worlds", each wrapping the star | full‑bleed illustration and 3D | **1‑beat hard‑cut burst** |
| 5.6–6.4 | Etched illustration | full bleed | slow zoom |
| 6.4–7.1 | Patreon card on indigo field | phone card ≈ 45 % of height, ~30 % side margins | **card expands to become the frame**: the container grows to full screen in about 0.3 s (morph) |
| 7.1–8.3 | Patreon search field, isolated | one component centred, huge negative space | typing; results list settles in, staggered |
| 8.3–10.3 | The Athletic | dark field, phones fanned around a photo | phones slide in with a stagger, ~0.57 s each, `(0.61,0.19,0.25,0.85)` |
| 10.3–12.4 | Ro desktop page | white field, page content only (no browser chrome) | headline rises, numbers count |
| 12.4–13.1 | Ro phone | phone ≈ 50 % of height, centred | **phone holds while a magenta→blue bloom swells behind it** |
| 13.1–16.0 | Ro bottom nav bar, isolated | **one UI component scaled 3–4×** | nav item states toggle on beats |
| 16.1–19.6 | Insider | isometric tilt (~‑30°) of 3 screens on white | slow push‑in, then **hard cut on the beat** |
| 19.6–25.2 | Calvin Klein | warm sand field; PDP floats with ~10 % margins | card swaps, then full‑bleed hero imagery |
| 25.2–26.6 | Pixel‑mosaic transition | full bleed | stylised wipe (used once) |
| 26.6–30.8 | Forest → in‑car UI | photo, then the UI inside a 3D dash | camera dolly, long settle |
| 31.0–33.0 | Tesla app | phone on pale lilac set | car rotates; phone slides up `(0.44,0.16,0.23,1.01)` |
| 33.0–34.3 | Hands on phone | photographic | live action |
| 34.3–39.0 | Upwork | typing headline, then search field isolated full‑frame | **container grows and wipes in green** |
| 39.0–40.8 | Upwork phones | phone ≈ 70 % of height; solid field changes every beat | **anchor phone fixed; field colour hard‑cuts each beat** |
| 41–46 | Tripadvisor | photo grid → phone centred over a blurred grid | photos cascade in, the phone is the anchor |
| 46–49 | Intel / Sorare | desktop panels on 3D plinths | slow camera orbit |
| 49–54 | Neuralink | dark field, 3D object, UI copy inside it | long settle `(0.19,0.0,0.14,0.83)` |
| 54–61 | Sorare | card hero → phone centred | **phone holds; circular colour wipes sweep from the bottom‑right corner (blue → red), and the screen content swaps in sync** |
| 61–64 | Genies | avatar + colour‑wheel card | component isolated next to the character |
| 64–71 | Headspace | brand illustration → web pages floating on white | orange blob morphs into the page |
| 71–77 | Collage of everything | full‑bleed moodboard | slow pull‑back |
| 77–89 | Client logos | type on black | 1‑beat burst → grid → mark |

### 2024 brand reel

| t (s) | Shot | Notes |
|---|---|---|
| 0–11 | Neon edges → 3D star → mark morphs → wordmark | brand opener; slow, long glides |
| 11–16 | Brand applications (field guide, cards, posters, phone) | **1‑beat burst**; split‑screens with hard gutters |
| 16–21 | "We make interfaces" site hero → glass card | long take, dark ultraviolet |
| 21–26 | Type specimen | full‑bleed type, 1‑beat steps |
| 26–30 | Site / poster / merch | **1‑beat burst** |
| **30–35** | **The "frames" sequence** | one empty frame outline opens → fills with a grid of cells → pulls back into a field of frames → the cells fill with work → **camera pushes into one cell until it is full‑bleed** (a "Financial Report" UI). That is the portal handoff. |
| 35–48 | Product work | two‑up pairings (phone + component card), 2–3 % white gutters, UIs on photographic surfaces; whole tiles slide; 1‑beat steps |
| 48–54 | Culture / brand | **1‑beat burst** |
| 54–60 | 3D wordmark fly‑through → wordmark | closer |

## 3. Framing

- **Screens float; they are rarely full‑bleed.** A desktop page sits at ~65–75 % of frame width and a phone at 45–75 % of frame height, centred, on a flat colour field. Full‑bleed is saved for (a) photography and (b) the moment a frame *becomes* the screen.
- **No browser or device chrome on web pages.** You see clean rounded rectangles. Phones are rounded screens with little or no bezel. 3D devices appear only in "hero object" shots.
- **Component isolation is the signature.** One real component (search field, nav bar, card, colour picker) sits alone, centred, scaled 1.5–4×, with acres of negative space. It is always complete. Nothing is cropped through the middle of a control.
- **Margins are generous.** A settled object never sits closer than ~8–10 % of frame width to an edge.
- **Rule of one or two.** A shot holds either one hero object or a deliberate pair (phone + card). Three or more objects appear only in cascades or collages, and those are always in motion.

## 4. How UI components are isolated and animated

1. **Pull‑out.** The component leaves its page (Ro nav bar, Patreon search) and keeps its real proportions. The page behind recedes or disappears.
2. **Interaction on the beat.** Toggles flip, items select and fields type, each on a beat.
3. **Staggered cascade.** Lists and phones enter one after another, 3–6 frames apart, all with the same decelerating curve.
4. **Anchor + changing world.** The component or phone stays still while the field colour (Upwork, Sorare, Ro) or its content swaps around it.
5. **Phones** stay upright and centred. They move by translation, and occasionally a slow isometric tilt (Insider).

## 5. Transition vocabulary (2022 + 2024, approximate counts)

| Transition | Count | Character |
|---|---|---|
| Hard cut on the beat (burst) | ~45 | the dominant cut; content always moving on both sides |
| **Momentum cut**: move accelerates into the cut, the next shot decelerates out | ~10 | measured pairs: speed peaks at 0.8–0.9 of the outgoing move and 0.1 of the incoming one, so the cut hides at maximum velocity |
| **Container expands to become the frame** (card → screen, cell → full‑bleed) | ~5 | the 2024 "frames/portal" handoff; Patreon in 2022 |
| Anchor holds, world changes (colour bloom, circular wipe, hard‑cut fields) | ~6 | Ro, Upwork, Sorare, Tripadvisor |
| Continuous camera move (push / dolly / orbit) | ~8 | long takes |
| Stylised wipes (pixel mosaic) | 1 | rare spice; avoid |
| Crossfade | 0 | **never** |

## 6. Easing (measured)

Clean fits (RMSE < 0.02), taken from optical flow:

| Move | Duration | Fitted cubic‑bezier |
|---|---|---|
| 2024 frames, push into cell (31.3 s) | 2.27 s | (0.59, ‑0.05, 0.12, 0.99) |
| 2024 frames, pull‑back (33.9 s) | 1.57 s | (0.82, 0.04, 0.16, **1.14**) |
| 2024 tile slide (35.6 s) | 1.13 s | (0.77, 0.06, 0.21, 0.96) |
| 2024 tile slide (37.0 s) | 1.07 s | (0.80, 0.06, 0.12, 0.97) |
| 2022 Athletic phone slide | 0.57 s | (0.61, 0.19, 0.25, 0.85) |
| 2022 Ro nav settle | 0.73 s | (0.44, 0.16, 0.23, 1.01) |
| 2022 Neuralink settle | 0.83 s | (0.19, 0.00, 0.14, 0.83) |
| 2022 Sorare wipe | 0.50 s | (0.29, 0.03, 0.29, 0.87) |
| Decel out of momentum cuts | 0.5–2.8 s | speed peak at 9–14 % → expo‑out |
| Accel into momentum cuts | 0.3–1.1 s | speed peak at 79–90 % → expo‑in |

What the numbers mean:
- **Large moves are strong ease‑in‑out with a long, quiet settle.** Peak speed sits mid‑move, and both ends are near zero. The 2024 language is consistent at about `(0.8, 0.05, 0.15, 1)`.
- **Entrances decelerate hard. Exits accelerate and are about 2× faster** (exits 0.3–0.5 s, entrances 0.5–1.4 s).
- **Overshoot is rare and small.** The most is ~4–14 % on a scale handoff, and it is never a visible bounce. No springs.

## 7. Colour, background and depth

- **2022:** each project owns a flat field colour pulled from its brand (Ro white→magenta, Upwork green, Sorare blue→red, Headspace blue, CK sand), and the field changes on the beat.
- **2024:** a brand palette of black + ultraviolet with white, and product work on neutral or photographic surfaces.
- **Depth is quiet.** Floating screens get a very soft, wide, low‑opacity shadow. Dark fields use no shadow, only a faint edge. No heavy glows, no bevels.

## 8. The 2024 "Frames" language (from the reel + the Awwwards case study)

- The motion language starts from **frames**, which become **portals** into the Metalab universe. Interaction (or the edit) *opens* them; nothing happens on its own.
- Grammar seen in the reel:
  1. **Open**: an empty frame outline appears and fills.
  2. **Nest**: frames sit inside frames (grid of cells, cell inside the screen).
  3. **Expand / hand off**: the camera pushes into one frame until it *is* the screen, and the next world lives inside it.
  4. **Levels focus as you go deeper**: Metalab → client → project.
- The case study also lists two concepts that were explored and not shipped as the core: "Constellations" and "Editorial layers". The creative director's warning against "Frankenstein" mixes is the reason the spec below commits to **one** system: Frames.
