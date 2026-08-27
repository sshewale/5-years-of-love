// ─── Haptic feedback utility ───────────────────────────────────────────────
// Wraps navigator.vibrate() — silently no-ops on browsers that don't support it.

/** Short single tap — button presses */
export function hapticTap(): void {
  navigator.vibrate?.(10)
}

/** Success pattern — correct quiz answer, confetti */
export function hapticSuccess(): void {
  navigator.vibrate?.([20, 40, 60])
}

/** Error pattern — wrong quiz answer */
export function hapticError(): void {
  navigator.vibrate?.([30, 20, 30])
}

/** Celebration burst — full confetti moment */
export function hapticCelebration(): void {
  navigator.vibrate?.([50, 30, 50, 30, 100])
}
