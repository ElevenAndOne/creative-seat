import { useEffect, useRef } from 'react'
import { cn } from '../utils/cn'

/**
 * The boil: like hand-drawn animation, the etching is "redrawn" as a short
 * cycle of slightly different drawings, played on a low frame rate.
 */
const BOIL_FPS = 8
const BOIL_DRAWINGS = 3

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

/**
 * Pencil-sketch shader, after Maya Nedeljković Batić's "Sketchy Pencil Effect
 * with Three.js Post-Processing" (Codrops, 2022), adapted from a 3D scene to a
 * photo:
 *
 * - Lines: a Sobel edge pass over the photo, thresholded into pencil lines —
 *   but the photo is read through smooth "clouds" noise, so every line
 *   squiggles a little off true, the way a hand drifts.
 * - Shading: the article's normal-buffer trick. A softened copy of the photo
 *   stands in for the normals; its gradient, scaled per pixel by fine noise,
 *   breaks into grainy pencil texture wherever a form turns. It's read through
 *   different clouds, so shading and outline don't quite register.
 * - Tone: darker areas gather directional pencil grain.
 *
 * The pencil lifts here and there, paper grain shows through, and near the
 * pointer it presses harder. Sizes are in CSS pixels, so it looks the same at
 * any pixel density.
 */
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uImage;
uniform sampler2D uSoft;
uniform vec2 uImageSize;
uniform vec2 uRes;
uniform vec4 uRect;
uniform float uSeed;
uniform vec2 uMouse;
uniform float uDpr;
uniform vec3 uPaper;
uniform vec3 uInk;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec2 grad(vec2 i) {
  float a = hash(i) * 6.2831853;
  return vec2(cos(a), sin(a));
}
// Gradient noise (after Inigo Quilez), on a float hash so it runs on WebGL 1. About -0.7 to 0.7.
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(grad(i), f), dot(grad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(grad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(grad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
// Smooth clouds — the article's "Render Clouds" texture, made procedurally.
float clouds(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * gnoise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}
float luma(sampler2D t, vec2 uv) { return dot(texture2D(t, uv).rgb, vec3(0.299, 0.587, 0.114)); }

// A pencil stroke along the zero line of a noise field g, halfW device pixels
// either side — kept an even width with screen-space derivatives where the GPU
// has them, so strokes never swell into blobs where the noise flattens out.
float stroke(float g, float halfW) {
#ifdef DERIVATIVES
  float d = abs(g) / max(fwidth(g), 1e-4);
  return 1.0 - smoothstep(halfW - 0.5, halfW + 0.5, d);
#else
  return 1.0 - smoothstep(0.03, 0.06, abs(g));
#endif
}

// Sobel: squared gradient magnitude of a texture's luminance, taps \`s\` apart.
float sobel(sampler2D t, vec2 uv, vec2 s) {
  float tl = luma(t, uv + s * vec2(-1.0, -1.0));
  float ml = luma(t, uv + s * vec2(-1.0, 0.0));
  float bl = luma(t, uv + s * vec2(-1.0, 1.0));
  float tc = luma(t, uv + s * vec2(0.0, -1.0));
  float bc = luma(t, uv + s * vec2(0.0, 1.0));
  float tr = luma(t, uv + s * vec2(1.0, -1.0));
  float mr = luma(t, uv + s * vec2(1.0, 0.0));
  float br = luma(t, uv + s * vec2(1.0, 1.0));
  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -tl - 2.0 * tc - tr + bl + 2.0 * bc + br;
  return gx * gx + gy * gy;
}

void main() {
  vec2 dev = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 c = dev / uDpr;
  vec2 size = uRes / uDpr;
  float boil = uSeed;

  // Paper, with a faint uneven grain.
  float grain = gnoise(c * 0.9) + 0.5;
  vec3 col = uPaper * (0.97 + 0.04 * grain);

  vec2 base = (dev - uRect.xy) / uRect.zw;
  if (base.x < 0.0 || base.x > 1.0 || base.y < 0.0 || base.y > 1.0) {
    gl_FragColor = vec4(col, 1.0);
    return;
  }

  // The squiggle: read the photo through smooth clouds, lines and shading
  // through different ones, re-drawn slightly differently each boil frame.
  vec2 px = uDpr / uRect.zw;
  vec2 cloud = vec2(clouds(c * 0.004 + boil * 0.21), clouds(c * 0.004 + 31.0 + boil * 0.21));
  vec2 uvLine = base + cloud * 16.0 * px;
  vec2 uvShade = base + cloud.yx * 26.0 * px;
  vec2 texel = 1.0 / uImageSize;

  // Pencil lines — fading where the pencil lifts.
  float lineInk = smoothstep(0.035, 0.08, sobel(uImage, uvLine, texel) * 0.36);
  lineInk *= smoothstep(-0.35, 0.1, gnoise(c * 0.05 + boil * 3.7));

  // Shading: the soft photo's gradient, scaled by fine per-pixel noise.
  float n = gnoise(c * 0.7 + boil * 11.0) * 14.0;
  float shadeInk = smoothstep(0.01, 0.03, sobel(uSoft, uvShade, texel * 2.0) * SHADE * n * n);

  // Tone: pencil strokes traced along the contours of stretched noise — thin,
  // wandering, never evenly spaced — thickening and multiplying as it darkens,
  // with a second direction in the deepest shadows.
  float l = clamp((luma(uSoft, uvShade) - 0.5) * 1.3 + 0.55, 0.0, 1.0);
  if (uMouse.x >= 0.0) l -= 0.22 * (1.0 - smoothstep(0.0, 170.0, distance(c, uMouse / uDpr)));
  float tone = 1.0 - smoothstep(0.15, 0.75, l);
  float halfW = (0.25 + 0.4 * tone) * uDpr;
  float g1 = gnoise(mat2(0.8, 0.6, -0.6, 0.8) * c * vec2(0.22, 0.02) + boil * 5.3);
  float g2 = gnoise(mat2(0.6, -0.8, 0.8, 0.6) * c * vec2(0.24, 0.024) + 9.0 + boil * 4.1);
  float toneInk = stroke(g1, halfW) * smoothstep(0.08, 0.4, tone);
  toneInk = max(toneInk, stroke(g2, halfW * 0.9) * smoothstep(0.55, 0.85, tone));

  float ink = max(lineInk * 0.9, max(shadeInk * 0.2, toneInk * 0.85));
  ink *= 0.75 + 0.25 * smoothstep(0.2, 0.7, grain);

  // The drawing runs under the copy, lighter there so the type still reads —
  // easing in from the left on wide canvases, from the top on tall ones,
  // along a ragged edge.
  float wash = clouds(c * 0.01) * 0.2;
  float safe = size.x > size.y ? smoothstep(0.12, 0.5, c.x / size.x + wash) : smoothstep(0.2, 0.55, c.y / size.y + wash);
  ink *= mix(0.4, 1.0, safe) * smoothstep(0.0, 0.08, base.x + wash * 0.5) * 0.85;

  gl_FragColor = vec4(mix(col, uInk, ink), 1.0);
}`.replace('SHADE', '0.02')

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
  return shader
}

interface SketchCanvasProps {
  src: string
  /** Paper and ink colours, as #rrggbb. */
  paper: string
  ink: string
  /** Where the subject sits across the photo (0–1), kept in view on narrow screens. */
  focusX?: number
  className?: string
}

/**
 * A photo redrawn live as a pencil sketch — WebGL, no libraries. It only
 * redraws on a boil frame or when the pointer moves, and pauses off screen.
 * Purely decorative; if WebGL is missing the section simply keeps its plain
 * paper colour.
 */
export default function SketchCanvas({ src, paper, ink, focusX = 0.6, className }: SketchCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!canvas || !gl) return

    let program: WebGLProgram
    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX))
      // Even-width strokes need screen-space derivatives (near-universal on WebGL 1).
      const derivatives = gl.getExtension('OES_standard_derivatives')
      const prefix = derivatives ? '#extension GL_OES_standard_derivatives : enable\n#define DERIVATIVES 1\n' : ''
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, prefix + FRAGMENT))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    } catch {
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(program, name)
    const uRes = u('uRes'), uRect = u('uRect'), uSeed = u('uSeed'), uMouse = u('uMouse'), uDpr = u('uDpr')
    gl.uniform3fv(u('uPaper'), hex(paper))
    gl.uniform3fv(u('uInk'), hex(ink))
    gl.uniform1i(u('uImage'), 0)
    gl.uniform1i(u('uSoft'), 1)

    let image: HTMLImageElement | null = null
    let dpr = 1
    let mouse: [number, number] = [-1, -1]
    let visible = false
    let dirty = true
    let frame = 0
    let lastBoil = -1

    const layout = () => {
      // 1.5× is plenty for one-pixel ink lines and keeps the shader cheap on big screens.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      dirty = true
    }

    /**
     * The photo's box, bleeding past the edges so the drawing fills the band
     * and runs under the copy: on wide canvases at least 1.3× the height and
     * most of the width, right-aligned and cropped from the bottom so her head
     * stays in; on tall ones the lower 85%, centred on the subject.
     */
    const rect = () => {
      const W = canvas.width, H = canvas.height
      const aspect = image ? image.naturalWidth / image.naturalHeight : 16 / 9
      if (W / H > 1.2) {
        const w = Math.max(H * 1.3 * aspect, W * 0.82)
        const h = w / aspect
        // Crop from the bottom, never above the top 12% — that's where her head is.
        return [W - w * 0.97, Math.max(H - h, -h * 0.12), w, h]
      }
      const h = H * 0.85
      const w = h * aspect
      return [W * 0.5 - w * focusX, H - h, w, h]
    }

    const draw = (seed: number) => {
      if (!image) return
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform4fv(uRect, rect())
      gl.uniform1f(uSeed, seed)
      gl.uniform2f(uMouse, mouse[0], mouse[1])
      gl.uniform1f(uDpr, dpr)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      canvas.style.opacity = '1'
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!visible) return
      const boil = Math.floor((now / 1000) * BOIL_FPS) % BOIL_DRAWINGS
      if (boil !== lastBoil || dirty) {
        lastBoil = boil
        dirty = false
        draw(boil)
      }
    }

    const img = new Image()
    img.decoding = 'async'
    const upload = (unit: number, source: TexImageSource) => {
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    }
    img.onload = () => {
      upload(0, img)
      // The soft copy — a sixth the size, so linear filtering blurs it for
      // free. It stands in for the article's normal buffer.
      const soft = document.createElement('canvas')
      soft.width = Math.max(1, Math.round(img.naturalWidth / 6))
      soft.height = Math.max(1, Math.round(img.naturalHeight / 6))
      const ctx2d = soft.getContext('2d')
      if (ctx2d) {
        ctx2d.imageSmoothingQuality = 'high'
        ctx2d.drawImage(img, 0, 0, soft.width, soft.height)
      }
      upload(1, soft)
      gl.uniform2f(u('uImageSize'), img.naturalWidth, img.naturalHeight)
      image = img
      dirty = true
    }
    img.src = src

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const box = canvas.getBoundingClientRect()
      const x = e.clientX - box.left, y = e.clientY - box.top
      mouse = x >= 0 && y >= 0 && x <= box.width && y <= box.height ? [x * dpr, y * dpr] : [-1, -1]
      dirty = true
    }
    // The canvas sits behind the copy, so listen on its section.
    const host = canvas.parentElement ?? canvas
    const onLeave = () => {
      mouse = [-1, -1]
      dirty = true
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    const resize = new ResizeObserver(layout)
    resize.observe(canvas)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) dirty = true
    })
    seen.observe(canvas)

    layout()
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      seen.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [src, paper, ink, focusX])

  return <canvas ref={ref} aria-hidden className={cn('pointer-events-none h-full w-full opacity-0 transition-opacity duration-700', className)} />
}
