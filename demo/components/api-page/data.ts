import type { PropRow } from './props-table'

export const ROOT_PROPS: PropRow[] = [
  {
    name: 'min, max',
    type: 'number',
    default: '1, 100',
    description: 'Numeric range. Ignored if items is set.',
  },
  {
    name: 'items',
    type: 'string[]',
    description: 'Switches to item mode — cycles through names instead of numbers.',
  },
  {
    name: 'interval',
    type: 'number',
    default: '100',
    description: 'Tick speed in ms, clamped to a minimum of 50.',
  },
  {
    name: 'random',
    type: 'boolean',
    default: 'true',
    description: 'Random pick per tick vs sequential increment.',
  },
  {
    name: 'inertia',
    type: 'boolean',
    default: 'false',
    description: 'Soft-start / soft-stop ramp instead of an instant flip.',
  },
  { name: 'autoStart', type: 'boolean', default: 'true', description: 'Begin cycling on mount.' },
  {
    name: 'noRepeat',
    type: 'boolean',
    default: 'true',
    description: 'Excludes previously frozen values from later rounds — no duplicate winners.',
  },
  {
    name: 'initialValue',
    type: 'number | string',
    description: 'Value shown before the first run.',
  },
  {
    name: 'finalValue',
    type: 'number | string',
    description: 'Forces settle to land on this value while the cycle still looks random.',
  },
  {
    name: 'onSelect',
    type: '(value) => void',
    description: 'Fires once per round, when the phase settles to frozen.',
  },
  {
    name: 'onExhausted',
    type: '() => void',
    description: 'Fires when start() runs but noRepeat has already drawn every candidate.',
  },
  { name: 'as', type: 'ElementType', default: "'div'", description: 'Wrapper element/component.' },
  {
    name: 'className, style',
    type: 'string, CSSProperties',
    description: 'Wrapper class / inline style.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Compound sub-components — Value, Button, Countdown, Slots.',
  },
]

export const VALUE_PROPS: PropRow[] = [
  {
    name: 'animation',
    type: "'roll' | 'fade' | 'blur' | 'reel'",
    default: "'roll'",
    description: 'Opt-in CSS animation, bound to the current tick duration.',
  },
  { name: 'as', type: 'ElementType', default: "'span'", description: 'Rendered element.' },
  { name: 'className, style', type: 'string, CSSProperties', description: 'Class / inline style.' },
]

export const BUTTON_PROPS: PropRow[] = [
  {
    name: 'startLabel',
    type: 'ReactNode',
    description: 'Shown in idle / frozen — click starts a round.',
  },
  {
    name: 'stopLabel',
    type: 'ReactNode',
    description: 'Shown in running / starting — click stops.',
  },
  { name: 'waitLabel', type: 'ReactNode', description: 'Shown in settling. Button is disabled.' },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Fallback label when no state-specific label is set.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description:
      'External disable, on top of the automatic disable during settling / when noRepeat is exhausted.',
  },
  { name: 'className, style', type: 'string, CSSProperties', description: 'Class / inline style.' },
]

export const COUNTDOWN_PROPS: PropRow[] = [
  {
    name: 'seconds',
    type: 'number',
    description: 'Required. Auto-freeze delay. Renders only while running.',
  },
  { name: 'className, style', type: 'string, CSSProperties', description: 'Class / inline style.' },
  {
    name: 'children',
    type: '(remaining: number) => ReactNode',
    description: 'Render-prop for fully custom output instead of the built-in ring + label.',
  },
]

export const SLOTS_PROPS: PropRow[] = [
  { name: 'length', type: 'number', default: '3', description: 'Number of independent reels.' },
  {
    name: 'chars',
    type: 'string',
    default: "'0123456789'",
    description: 'Charset pool each reel picks from. Emoji-safe.',
  },
  {
    name: 'spinInterval',
    type: 'number',
    default: '80',
    description: 'Tick rate per reel, ms, clamped ≥ 50.',
  },
  {
    name: 'staggerMs',
    type: 'number',
    default: '220',
    description: 'Delay between consecutive reel stops on settle.',
  },
  {
    name: 'onResult',
    type: '(joined: string) => void',
    description: 'Fires when the last reel lands, with the joined result.',
  },
  {
    name: 'className, slotClassName',
    type: 'string',
    description: 'Class for the row wrapper / each individual reel.',
  },
  {
    name: 'style, slotStyle',
    type: 'CSSProperties',
    description: 'Inline style for the row wrapper / each reel.',
  },
]

export const WHEEL_PROPS: PropRow[] = [
  {
    name: 'segments',
    type: 'string[]',
    default: 'root pool',
    description:
      'Relabel segments. The winner still comes from the root; label i maps to pool position i.',
  },
  { name: 'size', type: 'number', default: '320', description: 'Outer diameter in px.' },
  {
    name: 'colors',
    type: 'string[]',
    default: '6-color palette',
    description: 'Segment fills, cycled across segments.',
  },
  { name: 'labelColor', type: 'string', default: "'#fff'", description: 'Label text color.' },
  {
    name: 'maxLabels',
    type: 'number',
    default: '40',
    description:
      'Hide labels past this many segments — they overlap into noise. Segments still work.',
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '4200',
    description: 'Landing animation length in ms, from freeze to rest.',
  },
  {
    name: 'turns',
    type: 'number',
    default: '4',
    description: 'Extra full revolutions before the landing angle.',
  },
  {
    name: 'spinInterval',
    type: 'number',
    default: '1800',
    description: 'Free-spin speed while running, ms per full turn.',
  },
  {
    name: 'pointer',
    type: "'top' | 'right'",
    default: "'top'",
    description: 'Where the pointer sits on the rim.',
  },
  {
    name: 'hidePointer',
    type: 'boolean',
    default: 'false',
    description: 'Drop the built-in triangle to render your own.',
  },
  {
    name: 'onResult',
    type: '(value) => void',
    description:
      'Fires when the wheel comes to rest. Use this — not the root onSelect — to reveal a result.',
  },
  {
    name: 'className, style',
    type: 'string, CSSProperties',
    description: 'Style hooks on the wheel wrapper.',
  },
]

export const CONTEXT_FIELDS: PropRow[] = [
  {
    name: 'phase',
    type: "'idle' | 'starting' | 'running' | 'settling' | 'frozen'",
    description: 'Current state machine phase.',
  },
  {
    name: 'displayed',
    type: 'number | string',
    description: 'Value to render post-freeze / pre-cycle.',
  },
  {
    name: 'noRepeat, exhausted, remaining',
    type: 'boolean, boolean, number',
    description: 'no-repeat pool state.',
  },
  {
    name: 'start, freeze, reset',
    type: '() => void',
    description: 'Phase actions — start() is a no-op + fires onExhausted when the pool is empty.',
  },
  {
    name: 'resetHistory',
    type: '() => void',
    description: 'Clears the noRepeat draw history without unmounting.',
  },
  {
    name: 'subscribe',
    type: '(fn: (value: number) => void) => () => void',
    description: 'Tick subscription — for building fully custom renderers.',
  },
  { name: 'total', type: 'number', description: 'Pool size — item count, or max - min + 1.' },
  {
    name: 'valueAt',
    type: '(position: number) => number | string',
    description: 'Pool entry at a 0-based position, whichever mode the root is in.',
  },
]

export const TYPE_ROWS: PropRow[] = [
  {
    name: 'RafflePickValue',
    type: 'number | string',
    description: 'Value type used across value, onSelect, initialValue, finalValue.',
  },
  {
    name: 'AnimationType',
    type: "'roll' | 'fade' | 'blur' | 'reel'",
    description: 'Value animation kinds.',
  },
  {
    name: 'RafflePickPhase',
    type: "'idle' | 'starting' | 'running' | 'settling' | 'frozen'",
    description: 'The phase state machine.',
  },
  {
    name: 'RaffleContextValue',
    type: 'object',
    description: 'Return type of useRaffleContext() — everything above.',
  },
]
