import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { joinClassNames } from '../../utils/class-names'
import type { RafflePickWheelProps } from '../../types'
import { useRaffleContext } from './context'

const DEFAULT_COLORS = ['#7c1d29', '#d4a04a', '#2f4858', '#a83b2c', '#ecc878', '#4a0f18']

const VIEWBOX = 100
const CENTER = VIEWBOX / 2
const RADIUS = 48
const LABEL_RADIUS = RADIUS * 0.66

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Point on the wheel rim at `deg`, measured clockwise from 12 o'clock. */
const rimPoint = (deg: number, radius: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) }
}

const segmentPath = (index: number, total: number) => {
  const sweep = 360 / total
  const a0 = index * sweep
  const a1 = a0 + sweep
  const p0 = rimPoint(a0, RADIUS)
  const p1 = rimPoint(a1, RADIUS)
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${CENTER} ${CENTER} L ${p0.x} ${p0.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`
}

/**
 * Rotation, in degrees, that parks the centre of segment `position` under a
 * pointer sitting at `pointerDeg` clockwise from 12 o'clock.
 */
const restAngleFor = (position: number, total: number, pointerDeg: number) =>
  pointerDeg - (position + 0.5) * (360 / total)

/**
 * Next rotation past `from` that lands on `position`, after at least `turns`
 * more full revolutions. Always forward, so the wheel never visibly rewinds.
 */
const landingAngle = (
  from: number,
  position: number,
  total: number,
  turns: number,
  pointerDeg: number
) => {
  const base = from + turns * 360
  const target = restAngleFor(position, total, pointerDeg)
  const delta = (((target - base) % 360) + 360) % 360
  return base + delta
}

export function RafflePickWheel({
  segments,
  size = 320,
  colors = DEFAULT_COLORS,
  labelColor = '#fff',
  maxLabels = 40,
  spinDuration = 4200,
  turns = 4,
  spinInterval = 1800,
  pointer = 'top',
  hidePointer = false,
  className,
  style,
  onResult,
}: RafflePickWheelProps) {
  const { phase, total, valueAt, valueRef, hasItems, displayed } =
    useRaffleContext('RafflePick.Wheel')

  const count = segments?.length ?? total
  const safeCount = Math.max(1, count)

  const labels = useMemo(() => {
    if (segments) return segments
    return Array.from({ length: safeCount }, (_, i) => String(valueAt(i)))
  }, [segments, safeCount, valueAt])

  // Numeric mode indexes the pool by the value itself (min..max), items mode by
  // array position. Both have to collapse to a 0-based segment position.
  const indexOffset = useMemo(() => {
    if (hasItems || segments) return 0
    const first = valueAt(0)
    return typeof first === 'number' ? first : 0
  }, [hasItems, segments, valueAt])

  const pointerDeg = pointer === 'right' ? 90 : 0

  const wheelRef = useRef<SVGSVGElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const liveRef = useRef<HTMLSpanElement | null>(null)
  const rotationRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef(0)

  // `resting` only drives a data attribute and the live region, so it is written
  // straight to the DOM. Keeping it out of state avoids a re-render mid-landing.
  const setResting = useCallback((rest: boolean, announce?: string) => {
    const root = rootRef.current
    if (root) {
      if (rest) root.setAttribute('data-resting', '')
      else root.removeAttribute('data-resting')
    }
    const live = liveRef.current
    if (live) live.textContent = rest && announce !== undefined ? announce : ''
  }, [])

  const onResultRef = useRef(onResult)
  useEffect(() => {
    onResultRef.current = onResult
  })

  const write = useCallback((deg: number) => {
    const node = wheelRef.current
    if (node) node.style.transform = `rotate(${deg}deg)`
  }, [])

  const spinning = phase === 'starting' || phase === 'running' || phase === 'settling'

  // Free spin. Constant angular velocity driven by rAF rather than a CSS
  // animation, so `rotationRef` stays authoritative and the landing can start
  // from an exact angle instead of a sampled matrix.
  useEffect(() => {
    if (!spinning) return
    setResting(false)
    if (prefersReducedMotion()) return

    const node = wheelRef.current
    if (node) node.style.transition = 'none'
    lastFrameRef.current = 0

    const frame = (now: number) => {
      const last = lastFrameRef.current || now
      lastFrameRef.current = now
      rotationRef.current += ((now - last) / Math.max(200, spinInterval)) * 360
      write(rotationRef.current)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [spinning, spinInterval, write, setResting])

  // Landing. The root has already committed the winner to `valueRef` by the
  // time it dispatches `frozen`, so the target segment is known here — but the
  // wheel takes `spinDuration` more ms to get there, which is why `onResult`
  // rather than the root's `onSelect` is the signal to reveal a result.
  useEffect(() => {
    if (phase !== 'frozen') return

    const position = Math.min(safeCount - 1, Math.max(0, valueRef.current - indexOffset))
    const node = wheelRef.current

    if (prefersReducedMotion() || !node) {
      rotationRef.current = restAngleFor(position, safeCount, pointerDeg)
      write(rotationRef.current)
      setResting(true, String(displayed))
      onResultRef.current?.(displayed)
      return
    }

    const target = landingAngle(
      rotationRef.current,
      position,
      safeCount,
      Math.max(0, turns),
      pointerDeg
    )
    rotationRef.current = target

    node.style.transition = `transform ${spinDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`
    // Commit the pre-landing angle before the transition target, or the browser
    // coalesces both writes into one frame and the wheel jumps.
    void node.getBoundingClientRect()
    write(target)

    let done = false
    const finish = () => {
      if (done) return
      done = true
      setResting(true, String(displayed))
      onResultRef.current?.(displayed)
    }
    node.addEventListener('transitionend', finish, { once: true })
    // transitionend does not fire on a zero-delta landing or a backgrounded tab.
    const fallback = setTimeout(finish, spinDuration + 120)

    return () => {
      node.removeEventListener('transitionend', finish)
      clearTimeout(fallback)
    }
  }, [
    phase,
    safeCount,
    indexOffset,
    turns,
    spinDuration,
    write,
    valueRef,
    displayed,
    pointerDeg,
    setResting,
  ])

  // Park on the pre-selected entry before the first round.
  useEffect(() => {
    if (phase !== 'idle') return
    const position = Math.min(safeCount - 1, Math.max(0, valueRef.current - indexOffset))
    const node = wheelRef.current
    if (node) node.style.transition = 'none'
    rotationRef.current = restAngleFor(position, safeCount, pointerDeg)
    write(rotationRef.current)
    setResting(true)
  }, [phase, safeCount, indexOffset, write, valueRef, pointerDeg, setResting])

  const showLabels = safeCount <= maxLabels
  const fontSize = Math.max(2.2, Math.min(5, 42 / safeCount + 1.6))

  const paths = useMemo(
    () =>
      Array.from({ length: safeCount }, (_, i) => ({
        d: safeCount === 1 ? '' : segmentPath(i, safeCount),
        fill: colors[i % colors.length],
        mid: (i + 0.5) * (360 / safeCount),
      })),
    [safeCount, colors]
  )

  const cls = joinClassNames('rrp-wheel', className)

  const pointerStyle: CSSProperties =
    pointer === 'right'
      ? {
          position: 'absolute',
          top: '50%',
          right: '-2%',
          width: '10%',
          height: '14%',
          transform: 'translateY(-50%)',
        }
      : {
          position: 'absolute',
          left: '50%',
          top: '-2%',
          width: '14%',
          height: '10%',
          transform: 'translateX(-50%)',
        }

  return (
    <div
      ref={rootRef}
      className={cls}
      style={{
        position: 'relative',
        display: 'inline-block',
        lineHeight: 0,
        ...style,
        width: size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
      }}
      data-phase={phase}
      data-pointer={pointer}
      data-resting=""
    >
      {/* The disc is a square SVG under a rotation, so its layout box grows to
          side x sqrt(2) at 45 degrees and pushes the page into a sideways
          scroll. The drawn wheel is the inscribed circle, so clipping to a
          circle hides only empty corners and keeps the box honest. */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: '50%',
        }}
      >
        <svg
          ref={wheelRef}
          className="rrp-wheel__disc"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          role="img"
          aria-label={`Wheel with ${safeCount} segments`}
        >
          {safeCount === 1 ? (
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={paths[0].fill} />
          ) : (
            paths.map((p, i) => (
              <path key={i} d={p.d} fill={p.fill} stroke="rgba(0,0,0,0.14)" strokeWidth={0.3} />
            ))
          )}

          {showLabels &&
            paths.map((p, i) => {
              const pt = rimPoint(p.mid, LABEL_RADIUS)
              // Radial text points outward at `mid - 90`, which reads left-to-right
              // only while that angle stays within a quarter turn of horizontal.
              // Past the 180° mark it would render upside-down, so flip it.
              const flip = p.mid > 180
              const rotate = flip ? p.mid + 90 : p.mid - 90
              return (
                <text
                  key={i}
                  x={pt.x}
                  y={pt.y}
                  fill={labelColor}
                  fontSize={fontSize}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${rotate} ${pt.x} ${pt.y})`}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {labels[i]}
                </text>
              )
            })}
        </svg>
      </span>

      {!hidePointer && (
        <svg
          className="rrp-wheel__pointer"
          style={pointerStyle}
          viewBox="0 0 10 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points={pointer === 'right' ? '10,0 10,10 0,5' : '0,0 10,0 5,10'}
            fill="currentColor"
          />
        </svg>
      )}

      <span
        ref={liveRef}
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
        }}
      />
    </div>
  )
}
