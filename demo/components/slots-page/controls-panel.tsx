'use client'

import {
  ControlGroup,
  SelectField,
  Segmented,
  SliderField,
  ToggleField,
} from '../playground/fields'
import { DEFAULT_SLOTS_STATE, PRESET_CHARS, type SlotsPreset, type SlotsState } from './types'

const PRESETS: ReadonlyArray<SlotsPreset> = ['digits', 'symbols', 'letters', 'custom']

export function SlotsControlsPanel({
  state,
  onChange,
}: {
  state: SlotsState
  onChange: (next: SlotsState) => void
}) {
  const set = <K extends keyof SlotsState>(k: K, v: SlotsState[K]) => {
    onChange({ ...state, [k]: v })
  }

  return (
    <aside className="flex flex-col gap-6 self-start rounded-3 border border-line bg-bg-card p-6 lg:sticky lg:top-20">
      <ControlGroup label="Charset">
        <SelectField<SlotsPreset>
          label="Preset"
          value={state.preset}
          onChange={(v) => set('preset', v)}
          options={PRESETS}
        />
      </ControlGroup>

      {state.preset === 'custom' && (
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            Custom chars
          </label>
          <input
            value={state.customChars}
            onChange={(e) => set('customChars', e.target.value)}
            placeholder={PRESET_CHARS.digits}
            className="w-full rounded-2 border border-line bg-bg-card px-3 py-2.5 font-mono text-base text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
          />
        </div>
      )}

      <Segmented
        value={String(state.length)}
        onChange={(v) => set('length', Number(v))}
        options={[3, 4, 5, 6, 7].map((n) => ({ value: String(n), label: String(n) }))}
      />

      <SliderField
        label="Spin speed (ms/tick)"
        value={state.spinInterval}
        onChange={(n) => set('spinInterval', n)}
        min={50}
        max={300}
        step={10}
      />

      <SliderField
        label="Stagger (ms between reels)"
        value={state.staggerMs}
        onChange={(n) => set('staggerMs', n)}
        min={0}
        max={600}
        step={20}
      />

      <ToggleField label="Inertia" value={state.inertia} onChange={(b) => set('inertia', b)} />

      <button
        type="button"
        onClick={() => onChange(DEFAULT_SLOTS_STATE)}
        className="self-start rounded-2 border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-2 transition-colors hover:bg-bg-2"
      >
        Reset
      </button>
    </aside>
  )
}
