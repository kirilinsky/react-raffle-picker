'use client'

import {
  ControlGroup,
  NumberField,
  SelectField,
  Segmented,
  SliderField,
  TextArea,
  ToggleField,
} from './fields'
import { DEFAULT_STATE, type AnimationKind, type PlaygroundState } from './types'

const ANIMATIONS: ReadonlyArray<AnimationKind> = ['none', 'roll', 'fade', 'blur', 'reel']

export function ControlsPanel({
  state,
  onChange,
}: {
  state: PlaygroundState
  onChange: (next: PlaygroundState) => void
}) {
  const set = <K extends keyof PlaygroundState>(k: K, v: PlaygroundState[K]) => {
    onChange({ ...state, [k]: v })
  }

  return (
    <aside className="flex flex-col gap-6 self-start rounded-3 border border-line bg-bg-card p-6 lg:sticky lg:top-20">
      <ControlGroup label="Mode">
        <Segmented
          value={state.mode}
          onChange={(v) => set('mode', v)}
          options={[
            { value: 'range', label: 'Range' },
            { value: 'items', label: 'Items' },
          ]}
        />
      </ControlGroup>

      {state.mode === 'range' ? (
        <ControlGroup label="Range">
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Min" value={state.min} onChange={(n) => set('min', n)} />
            <NumberField label="Max" value={state.max} onChange={(n) => set('max', n)} />
          </div>
        </ControlGroup>
      ) : (
        <TextArea
          label="Items (one per line)"
          value={state.itemsRaw}
          onChange={(s) => set('itemsRaw', s)}
        />
      )}

      <SliderField
        label="Interval (ms)"
        value={state.interval}
        onChange={(n) => set('interval', n)}
        min={20}
        max={300}
        step={10}
      />

      <SliderField
        label="Countdown (s)"
        value={state.countdown}
        onChange={(n) => set('countdown', n)}
        min={0}
        max={30}
        step={1}
        display={state.countdown === 0 ? 'off' : `${state.countdown}s`}
      />

      <SelectField<AnimationKind>
        label="Animation"
        value={state.animation}
        onChange={(v) => set('animation', v)}
        options={ANIMATIONS}
      />

      <ToggleField label="Inertia" value={state.inertia} onChange={(b) => set('inertia', b)} />

      <ToggleField
        label="Autostart"
        value={state.autoStart}
        onChange={(b) => set('autoStart', b)}
      />

      <button
        type="button"
        onClick={() => onChange(DEFAULT_STATE)}
        className="self-start rounded-2 border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-2 transition-colors hover:bg-bg-2"
      >
        Reset
      </button>
    </aside>
  )
}
