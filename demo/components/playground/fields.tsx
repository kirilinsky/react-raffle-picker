'use client'

import { useId } from 'react'
import type { ReactNode } from 'react'

export function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{label}</span>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-2 border border-line bg-bg-card px-3 py-2.5 font-mono text-base text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20'

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (n: number) => void
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => {
          const next = e.currentTarget.valueAsNumber
          if (Number.isFinite(next)) onChange(next)
        }}
        className={inputCls}
      />
    </div>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string
  value: string
  onChange: (s: string) => void
  rows?: number
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} resize-none text-sm`}
      />
    </div>
  )
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  display,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step?: number
  display?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3"
        >
          {label}
        </label>
        <span className="font-mono text-sm text-burgundy">{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-burgundy"
      />
    </div>
  )
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<T>
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-2 border border-line bg-bg-card bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path fill=%22none%22 stroke=%22%238a7a66%22 stroke-width=%221.5%22 d=%22M1 1l5 5 5-5%22/></svg>')] bg-[right_0.75rem_center] bg-no-repeat px-3 py-2.5 pr-9 font-mono text-sm focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (b: boolean) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? 'bg-burgundy' : 'bg-line'}`}
      >
        <span
          aria-hidden="true"
          className="absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150"
          style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
}) {
  return (
    <div className="flex gap-1 rounded-2 bg-bg-2 p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-2 px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              active ? 'bg-burgundy text-gold-light' : 'text-ink-2 hover:bg-line'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
