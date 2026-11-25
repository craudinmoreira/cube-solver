import { describe, expect, it } from 'vitest'
import { useAnimationSpeed } from './useAnimationSpeed'
import { useThemeStore } from './useThemeStore'

describe('useAnimationSpeed', () => {
  it.each([
    [0, 0.5],
    [7, 7],
    [99, 20],
  ])('setSpeed(%s) → %s', (input, expected) => {
    useAnimationSpeed.getState().setSpeed(input)
    expect(useAnimationSpeed.getState().speed).toBe(expected)
  })
})

describe('useThemeStore', () => {
  it('alterna entre escuro e claro', () => {
    const { toggleTheme } = useThemeStore.getState()
    expect(useThemeStore.getState().theme).toBe('dark')
    toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')
    toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})
