/**
 * SPPG SaaS Platform - Marketing Design System
 * Enterprise-grade design tokens and component variants
 * Follows modern SaaS design principles with professional aesthetics
 */

// ===== ENTERPRISE SPACING SYSTEM =====
export const SPACING = {
  // Section spacing (consistent across all marketing sections)
  SECTION_Y: 'py-16 lg:py-24 xl:py-32',
  SECTION_CONTAINER: 'mx-auto max-w-7xl px-6 lg:px-8',
  CONTENT_MAX_WIDTH: 'mx-auto max-w-4xl',
  
  // Component spacing
  HEADER_BOTTOM: 'mb-12 lg:mb-16 xl:mb-20',
  GRID_GAP: 'gap-6 lg:gap-8 xl:gap-10',
  CARD_PADDING: 'p-6 lg:p-8',
  
  // Element spacing
  ELEMENT_SM: 'space-y-4',
  ELEMENT_MD: 'space-y-6',
  ELEMENT_LG: 'space-y-8',
} as const

// ===== ENTERPRISE TYPOGRAPHY SCALE =====
export const TYPOGRAPHY = {
  // Display text (hero titles)
  DISPLAY_XL: 'text-5xl font-bold tracking-tight lg:text-6xl xl:text-7xl',
  DISPLAY_LG: 'text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl',
  
  // Headings
  H1: 'text-3xl font-bold tracking-tight lg:text-4xl xl:text-5xl',
  H2: 'text-2xl font-bold tracking-tight lg:text-3xl xl:text-4xl',
  H3: 'text-xl font-semibold tracking-tight lg:text-2xl',
  H4: 'text-lg font-semibold tracking-tight lg:text-xl',
  
  // Body text
  BODY_XL: 'text-xl leading-8 lg:text-2xl lg:leading-9',
  BODY_LG: 'text-lg leading-7 lg:text-xl lg:leading-8',
  BODY: 'text-base leading-7',
  BODY_SM: 'text-sm leading-6',
  
  // Support text
  CAPTION: 'text-xs leading-5',
  OVERLINE: 'text-xs font-medium tracking-wide uppercase',
} as const

// ===== PROFESSIONAL COLOR PALETTE =====
export const COLORS = {
  // Neutral backgrounds (enterprise-grade)
  BG_PRIMARY: 'bg-white dark:bg-slate-900',
  BG_SECONDARY: 'bg-slate-50 dark:bg-slate-800',
  BG_TERTIARY: 'bg-slate-100 dark:bg-slate-700',
  BG_MUTED: 'bg-slate-50/50 dark:bg-slate-800/50',
  
  // Text hierarchy
  TEXT_PRIMARY: 'text-slate-900 dark:text-slate-50',
  TEXT_SECONDARY: 'text-slate-700 dark:text-slate-300',
  TEXT_TERTIARY: 'text-slate-600 dark:text-slate-400',
  TEXT_MUTED: 'text-slate-500 dark:text-slate-500',
  
  // Brand colors (professional blue palette)
  BRAND_PRIMARY: 'text-blue-600 dark:text-blue-400',
  BRAND_SECONDARY: 'text-blue-700 dark:text-blue-300',
  
  // Interactive elements
  INTERACTIVE_PRIMARY: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
  INTERACTIVE_SECONDARY: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
  
  // Status colors (semantic)
  SUCCESS: 'text-emerald-600 dark:text-emerald-400',
  WARNING: 'text-amber-600 dark:text-amber-400',
  ERROR: 'text-red-600 dark:text-red-400',
  INFO: 'text-blue-600 dark:text-blue-400',
  
  // Borders
  BORDER_DEFAULT: 'border-slate-200 dark:border-slate-700',
  BORDER_MUTED: 'border-slate-100 dark:border-slate-800',
  BORDER_ACCENT: 'border-blue-200 dark:border-blue-800',
} as const

// ===== COMPONENT VARIANTS (ENTERPRISE CARDS) =====
export const CARDS = {
  // Base card styles
  BASE: `${COLORS.BG_PRIMARY} ${COLORS.BORDER_DEFAULT} border rounded-xl shadow-sm`,
  ELEVATED: `${COLORS.BG_PRIMARY} ${COLORS.BORDER_DEFAULT} border rounded-xl shadow-lg`,
  INTERACTIVE: `${COLORS.BG_PRIMARY} ${COLORS.BORDER_DEFAULT} border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200`,
  
  // Feature cards
  FEATURE: `${COLORS.BG_PRIMARY} ${COLORS.BORDER_DEFAULT} border rounded-xl ${SPACING.CARD_PADDING} shadow-sm hover:shadow-md transition-all duration-300`,
  FEATURE_HIGHLIGHTED: `${COLORS.BG_PRIMARY} border-2 border-blue-500 rounded-xl ${SPACING.CARD_PADDING} shadow-lg relative`,
  
  // Stats cards
  STAT: `${COLORS.BG_PRIMARY} ${COLORS.BORDER_DEFAULT} border rounded-xl ${SPACING.CARD_PADDING} text-center shadow-sm hover:shadow-lg transition-all duration-300`,
} as const

// ===== BUTTON VARIANTS (ENTERPRISE ACTIONS) =====
export const BUTTONS = {
  // Primary actions
  PRIMARY: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300',
  PRIMARY_LARGE: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300',
  
  // Secondary actions
  SECONDARY: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300',
  SECONDARY_LARGE: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300',
  
  // Outline variants
  OUTLINE: `border-2 ${COLORS.BORDER_DEFAULT} hover:bg-slate-50 dark:hover:bg-slate-800 ${COLORS.TEXT_PRIMARY} font-semibold rounded-xl transition-all duration-300`,
} as const

// ===== GRID LAYOUTS (RESPONSIVE ENTERPRISE) =====
export const GRIDS = {
  // Stats and metrics
  STATS_2: 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8',
  STATS_3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
  STATS_4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8',
  
  // Features
  FEATURES_2: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
  FEATURES_3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
  FEATURES_4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8',
  
  // Content layouts
  CONTENT_SPLIT: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
  CONTENT_SIDEBAR: 'grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12',
  
  // Testimonials and case studies
  TESTIMONIALS: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  CASE_STUDIES: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
} as const

// ===== BADGES & STATUS INDICATORS =====
export const BADGES = {
  // Default badges
  DEFAULT: 'inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300',
  
  // Status badges
  SUCCESS: 'inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300',
  INFO: 'inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300',
  WARNING: 'inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300',
  
  // Special badges
  FEATURED: 'inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white',
  NEW: 'inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white',
} as const

// ===== ANIMATIONS & EFFECTS =====
export const EFFECTS = {
  // Entrance animations
  FADE_IN: 'animate-in fade-in duration-700',
  SLIDE_UP: 'animate-in slide-in-from-bottom-4 fade-in duration-700',
  SLIDE_DOWN: 'animate-in slide-in-from-top-4 fade-in duration-700',
  SCALE_IN: 'animate-in zoom-in-95 fade-in duration-500',
  
  // Hover effects
  HOVER_LIFT: 'hover:-translate-y-1 transition-transform duration-200',
  HOVER_SCALE: 'hover:scale-105 transition-transform duration-200',
  HOVER_GLOW: 'hover:shadow-xl transition-shadow duration-300',
  
  // Focus states
  FOCUS_RING: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
} as const

// ===== ICONS & VISUAL ELEMENTS =====
export const ICONS = {
  XS: 'h-4 w-4',
  SM: 'h-5 w-5',
  MD: 'h-6 w-6',
  LG: 'h-8 w-8',
  XL: 'h-10 w-10',
  XXL: 'h-12 w-12',
} as const

// ===== ENTERPRISE RESPONSIVE BREAKPOINTS =====
export const RESPONSIVE = {
  MOBILE_ONLY: 'block sm:hidden',
  TABLET_UP: 'hidden sm:block lg:hidden',
  DESKTOP_UP: 'hidden lg:block',
  MOBILE_TABLET: 'block lg:hidden',
  TABLET_DESKTOP: 'hidden sm:block',
} as const

// ===== DESIGN SYSTEM UTILITIES =====
export const UTILS = {
  // Content containers
  PROSE: 'prose prose-slate dark:prose-invert max-w-none',
  PROSE_LG: 'prose prose-lg prose-slate dark:prose-invert max-w-none',
  
  // Visual separators
  DIVIDER: 'border-t border-slate-200 dark:border-slate-700',
  DIVIDER_THICK: 'border-t-2 border-slate-200 dark:border-slate-700',
  
  // Screen readers
  SR_ONLY: 'sr-only',
  
  // Aspect ratios
  ASPECT_VIDEO: 'aspect-video',
  ASPECT_SQUARE: 'aspect-square',
} as const