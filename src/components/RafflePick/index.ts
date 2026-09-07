import { RafflePickRoot } from './RafflePick'
import { RafflePickValue } from './RafflePickValue'
import { RafflePickButton } from './RafflePickButton'
import { RafflePickCountdown } from './RafflePickCountdown'
import { RafflePickSlots } from './RafflePickSlots'
import { RafflePickWheel } from './RafflePickWheel'

type RafflePickCompound = typeof RafflePickRoot & {
  Value: typeof RafflePickValue
  Button: typeof RafflePickButton
  Countdown: typeof RafflePickCountdown
  Slots: typeof RafflePickSlots
  Wheel: typeof RafflePickWheel
}

const RafflePick = RafflePickRoot as RafflePickCompound
RafflePick.Value = RafflePickValue
RafflePick.Button = RafflePickButton
RafflePick.Countdown = RafflePickCountdown
RafflePick.Slots = RafflePickSlots
RafflePick.Wheel = RafflePickWheel

export {
  RafflePick,
  RafflePickValue,
  RafflePickButton,
  RafflePickCountdown,
  RafflePickSlots,
  RafflePickWheel,
}
export { useRaffleContext, RaffleContext } from './context'
export type { RaffleContextValue } from './context'
export type { RafflePickPhase } from '../../utils/inertia'
