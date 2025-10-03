declare module 'tinykeys' {
  export type KeyBindingMap = Record<string, (event: KeyboardEvent) => void>
  export interface TinykeysOptions {
    event?: 'keydown' | 'keyup'
    signal?: AbortSignal
  }

  export function createKeybindingsHandler(
    keymap: KeyBindingMap,
    options?: TinykeysOptions,
  ): (event: KeyboardEvent) => void
}
