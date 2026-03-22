import { computed, toValue } from 'vue'

const DEFAULT_PRIMARY = '#3b82f6'
const DEFAULT_BACKGROUND = '#ffffff'

const expandHexIfNeeded = (hex) => {
  return hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex
}

export const normalizeThemeColor = (value, fallback) => {
  if (!value) {
    return fallback
  }

  const trimmed = value.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  const isHex = /^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(withHash)
  const isColorFunction = /^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(.+\)$/i.test(trimmed)
  const isNamedColor = /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/.test(trimmed)

  if (isHex) {
    return expandHexIfNeeded(withHash)
  }

  if (isColorFunction || isNamedColor) {
    return trimmed
  }

  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('color', trimmed)) {
    return trimmed
  }

  return fallback
}

const buildPrimaryPalette = (primary) => {
  return {
    50: `color-mix(in srgb, ${primary} 8%, white)`,
    100: `color-mix(in srgb, ${primary} 16%, white)`,
    200: `color-mix(in srgb, ${primary} 28%, white)`,
    300: `color-mix(in srgb, ${primary} 42%, white)`,
    400: `color-mix(in srgb, ${primary} 62%, white)`,
    500: primary,
    600: `color-mix(in srgb, ${primary} 82%, black)`,
    700: `color-mix(in srgb, ${primary} 72%, black)`,
    800: `color-mix(in srgb, ${primary} 62%, black)`,
    900: `color-mix(in srgb, ${primary} 52%, black)`,
    950: `color-mix(in srgb, ${primary} 40%, black)`
  }
}

export const useCustomTheme = (options) => {
  const mode = computed(() => (toValue(options.mode) === 'dark' ? 'dark' : 'light'))
  const isDark = computed(() => mode.value === 'dark')

  const primary = computed(() => normalizeThemeColor(toValue(options.primary), DEFAULT_PRIMARY))
  const background = computed(() => normalizeThemeColor(toValue(options.background), DEFAULT_BACKGROUND))
  const palette = computed(() => buildPrimaryPalette(primary.value))

  const themeStyles = computed(() => ({
    '--ui-color-primary-50': palette.value[50],
    '--ui-color-primary-100': palette.value[100],
    '--ui-color-primary-200': palette.value[200],
    '--ui-color-primary-300': palette.value[300],
    '--ui-color-primary-400': palette.value[400],
    '--ui-color-primary-500': palette.value[500],
    '--ui-color-primary-600': palette.value[600],
    '--ui-color-primary-700': palette.value[700],
    '--ui-color-primary-800': palette.value[800],
    '--ui-color-primary-900': palette.value[900],
    '--ui-color-primary-950': palette.value[950],
    '--ui-primary': palette.value[500],
    color: isDark.value ? '#ffffff' : '#0f172a',
    backgroundColor: background.value
  }))

  return {
    mode,
    isDark,
    primary,
    background,
    themeStyles
  }
}
