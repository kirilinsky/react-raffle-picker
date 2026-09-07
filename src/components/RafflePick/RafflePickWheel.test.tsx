import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { RafflePick } from './index'

/**
 * jsdom has no rAF timing or transitions, so these cover the parts that must be
 * right regardless of rendering: segment count, label source, the winning
 * segment's rest angle, and that `onResult` reports the root's winner.
 */

const rotationOf = (svg: Element) => {
  const m = /rotate\((-?[\d.]+)deg\)/.exec((svg as SVGElement).style.transform)
  return m ? Number(m[1]) : null
}

/**
 * Wheel-local angle of whatever currently sits under the pointer. A segment
 * centre is at `(position + 0.5) * 360 / total`, so this is what the landing
 * assertions compare against.
 */
const centreUnderPointer = (rotation: number, pointerDeg = 0) =>
  (((pointerDeg - rotation) % 360) + 360) % 360

beforeEach(() => {
  vi.useFakeTimers()
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('<RafflePick.Wheel>', () => {
  it('renders one segment path per item', () => {
    const { container } = render(
      <RafflePick items={['A', 'B', 'C', 'D']} autoStart={false}>
        <RafflePick.Wheel />
      </RafflePick>
    )
    expect(container.querySelectorAll('.rrp-wheel path')).toHaveLength(4)
  })

  it('labels segments from the item pool', () => {
    render(
      <RafflePick items={['Alice', 'Bob']} autoStart={false}>
        <RafflePick.Wheel />
      </RafflePick>
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('labels segments from a numeric range', () => {
    render(
      <RafflePick min={5} max={7} autoStart={false}>
        <RafflePick.Wheel />
      </RafflePick>
    )
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('honours a `segments` override without changing the pool', () => {
    const { container } = render(
      <RafflePick items={['A', 'B']} autoStart={false}>
        <RafflePick.Wheel segments={['One', 'Two', 'Three']} />
      </RafflePick>
    )
    expect(container.querySelectorAll('.rrp-wheel path')).toHaveLength(3)
    expect(screen.getByText('One')).toBeInTheDocument()
  })

  it('hides labels past `maxLabels` but keeps the segments', () => {
    const { container } = render(
      <RafflePick min={1} max={60} autoStart={false}>
        <RafflePick.Wheel maxLabels={40} />
      </RafflePick>
    )
    expect(container.querySelectorAll('.rrp-wheel path')).toHaveLength(60)
    expect(container.querySelectorAll('.rrp-wheel text')).toHaveLength(0)
  })

  it('parks the pre-selected entry under the pointer while idle', () => {
    const { container } = render(
      <RafflePick items={['A', 'B', 'C', 'D']} initialValue="C" autoStart={false}>
        <RafflePick.Wheel />
      </RafflePick>
    )
    const svg = container.querySelector('.rrp-wheel__disc')!
    // "C" is position 2 of 4 → its centre sits at 2.5 * 90 = 225°.
    expect(centreUnderPointer(rotationOf(svg)!)).toBeCloseTo(225, 5)
  })

  it('lands the pointer on the frozen winner', () => {
    render(
      <RafflePick items={['A', 'B', 'C', 'D']} autoStart={false} finalValue="B">
        <RafflePick.Wheel spinDuration={100} />
        <RafflePick.Button startLabel="Draw" />
      </RafflePick>
    )

    act(() => {
      screen.getByRole('button').click()
    })
    act(() => {
      screen.getByRole('button').click()
    })

    const svg = document.querySelector('.rrp-wheel__disc')!
    // "B" is position 1 of 4 → centre at 1.5 * 90 = 135°.
    expect(centreUnderPointer(rotationOf(svg)!)).toBeCloseTo(135, 5)
  })

  it('lands correctly with a right-hand pointer', () => {
    render(
      <RafflePick items={['A', 'B', 'C', 'D']} autoStart={false} finalValue="B">
        <RafflePick.Wheel spinDuration={100} pointer="right" />
        <RafflePick.Button startLabel="Draw" />
      </RafflePick>
    )

    act(() => {
      screen.getByRole('button').click()
    })
    act(() => {
      screen.getByRole('button').click()
    })

    const svg = document.querySelector('.rrp-wheel__disc')!
    // Same winner, but read against a pointer 90° round the rim.
    expect(centreUnderPointer(rotationOf(svg)!, 90)).toBeCloseTo(135, 5)
  })

  it('spins forward only — the landing never rewinds past the start angle', () => {
    render(
      <RafflePick items={['A', 'B', 'C', 'D']} autoStart={false} finalValue="A">
        <RafflePick.Wheel spinDuration={100} turns={3} />
        <RafflePick.Button startLabel="Draw" />
      </RafflePick>
    )

    const svg = document.querySelector('.rrp-wheel__disc')!
    const before = rotationOf(svg)!

    act(() => {
      screen.getByRole('button').click()
    })
    act(() => {
      screen.getByRole('button').click()
    })

    expect(rotationOf(svg)!).toBeGreaterThan(before + 3 * 360 - 360)
  })

  it('reports the root winner through `onResult`', () => {
    const onResult = vi.fn()
    render(
      <RafflePick items={['A', 'B', 'C']} autoStart={false} finalValue="C">
        <RafflePick.Wheel spinDuration={50} onResult={onResult} />
        <RafflePick.Button startLabel="Draw" />
      </RafflePick>
    )

    act(() => {
      screen.getByRole('button').click()
    })
    act(() => {
      screen.getByRole('button').click()
    })
    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(onResult).toHaveBeenCalledWith('C')
  })

  it('keeps every label right-side up', () => {
    // Text rotated by θ reads left-to-right only while cos(θ) > 0; anything
    // else renders upside-down for the viewer.
    for (const total of [2, 3, 4, 6, 7, 12]) {
      const { container, unmount } = render(
        <RafflePick min={1} max={total} autoStart={false}>
          <RafflePick.Wheel />
        </RafflePick>
      )
      const texts = Array.from(container.querySelectorAll('.rrp-wheel text'))
      expect(texts).toHaveLength(total)

      for (const t of texts) {
        const deg = Number(/rotate\((-?[\d.]+)/.exec(t.getAttribute('transform')!)![1])
        expect(Math.cos((deg * Math.PI) / 180)).toBeGreaterThanOrEqual(0)
      }
      unmount()
    }
  })

  it('throws outside a <RafflePick> root', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<RafflePick.Wheel />)).toThrow(/must be rendered inside <RafflePick>/)
    spy.mockRestore()
  })
})
