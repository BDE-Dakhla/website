import { useEffect, useMemo } from 'react'
import { createKeybindingsHandler } from 'tinykeys'

export type ShortcutMap = Record<string, (e: KeyboardEvent) => void>

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const el = target.closest('input, textarea, select, [contenteditable="true"]')
  return Boolean(el)
}

export function useShortcuts(
  bindings: ShortcutMap,
  deps: unknown[] = [],
  opts?: {
    event?: 'keydown' | 'keyup'
    target?: Window | Document | HTMLElement | SVGElement
  },
) {
  const eventType = opts?.event ?? 'keydown'
  const target =
    opts?.target ?? (typeof window !== 'undefined' ? window : undefined)

  const keymap = useMemo(() => {
    return Object.fromEntries(
      Object.entries(bindings).map(([combo, handler]) => [
        combo,
        (e: KeyboardEvent) => {
          if (isTypingTarget(e.target) || e.isComposing) return
          handler(e)
        },
      ]),
    ) as ShortcutMap
    // biome-ignore lint/correctness/useExhaustiveDependencies: empty array by default
  }, deps)

  useEffect(() => {
    if (!target) return
    const handler = createKeybindingsHandler(keymap, { event: eventType })
    target.addEventListener(eventType, handler as EventListener)
    return () => target.removeEventListener(eventType, handler as EventListener)
  }, [keymap, target, eventType])
}

export const isMac =
  typeof navigator !== 'undefined' &&
  /(Mac|iPhone|iPad|iPod)/.test(navigator.platform)
export const mod = isMac ? 'Meta' : 'Control'
