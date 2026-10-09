import tinycolor from 'tinycolor2';

import { hasSolidBrandGradient, type GrafanaTheme, type GrafanaTheme2, type Radii } from '@grafana/data';

export function cardChrome(theme: GrafanaTheme2): string {
  return `
    background: ${theme.colors.background.secondary};
    &:hover {
      background: ${hoverColor(theme.colors.background.secondary, theme)};
    }
    box-shadow: ${theme.components.panel.boxShadow};
    border-radius: ${theme.shape.radius.default};
`;
}

export function hoverColor(color: string, theme: GrafanaTheme2): string {
  return theme.isDark ? tinycolor(color).brighten(2).toString() : tinycolor(color).darken(2).toString();
}

export function listItem(theme: GrafanaTheme2): string {
  return `
  background: ${theme.colors.background.secondary};
  &:hover {
    background: ${hoverColor(theme.colors.background.secondary, theme)};
  }
  box-shadow: ${theme.components.panel.boxShadow};
  border-radius: ${theme.shape.radius.default};
`;
}

export function listItemSelected(theme: GrafanaTheme2): string {
  return `
    background: ${hoverColor(theme.colors.background.secondary, theme)};
    color: ${theme.colors.text.maxContrast};
`;
}

export function mediaUp(breakpoint: string) {
  return `only screen and (min-width: ${breakpoint})`;
}

const isGrafanaTheme2 = (theme: GrafanaTheme | GrafanaTheme2): theme is GrafanaTheme2 => theme.hasOwnProperty('v1');
export const focusCss = (theme: GrafanaTheme | GrafanaTheme2) => {
  const isTheme2 = isGrafanaTheme2(theme);
  const firstColor = isTheme2 ? theme.colors.background.canvas : theme.colors.bodyBg;
  const secondColor = isTheme2 ? theme.colors.primary.main : theme.colors.formFocusOutline;

  return `
  outline: 2px dotted transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px ${firstColor}, 0 0 0px 4px ${secondColor};
  transition-property: outline, outline-offset, box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);`;
};

export function getMouseFocusStyles(theme: GrafanaTheme | GrafanaTheme2) {
  return {
    outline: 'none',
    boxShadow: `none`,
  };
}

export function getFocusStyles(theme: GrafanaTheme2) {
  if (hasSolidBrandGradient(theme)) {
    return {
      outline: `2px solid ${theme.isDark ? '#ffffff' : '#000000'}`,
      outlineOffset: '2px',
      boxShadow: 'none',
      transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
      transitionDuration: '0.1s',
      transitionProperty: 'outline, outline-offset, box-shadow',
    };
  }

  const visualRefreshEnabled = theme.flags.visualDesignRefresh;
  const boxShadowPlacement = visualRefreshEnabled ? 3 : 4;
  return {
    outline: '2px dotted transparent',
    outlineOffset: '2px',
    boxShadow: `0 0 0 2px ${theme.colors.background.canvas}, 0 0 0px ${boxShadowPlacement}px ${theme.colors.accent.main}`,
    transitionTimingFunction: `cubic-bezier(0.19, 1, 0.22, 1)`,
    transitionDuration: '0.2s',
    transitionProperty: 'outline, outline-offset, box-shadow',
  };
}

/** Fluent callouts use a small radius, a hairline border, and a short shadow. */
export function getCalloutChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return {};
  }

  return {
    borderRadius: theme.shape.radius.default,
    boxShadow: theme.shadows.z2,
    border: `1px solid ${theme.colors.border.weak}`,
  };
}

/** Neutral block and the lighter wave that crosses a Fluent shimmer. */
export function getFluentShimmerColors(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  if (theme.isDark) {
    return {
      baseColor: theme.colors.background.secondary,
      highlightColor: theme.colors.action.hover,
    };
  }

  return {
    baseColor: theme.colors.action.selected,
    highlightColor: theme.colors.background.secondary,
  };
}

/** Plain Fluent list rows: small corner and a neutral hover wash. */
export function getFluentListItemChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    borderRadius: theme.shape.radius.default,
    hoverBackground: theme.colors.action.hover,
  };
}

/** Small Fluent tooltip: 4px callout, hairline border, no beak. */
export function getFluentTooltipChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    background: theme.colors.background.elevated,
    border: `1px solid ${theme.colors.border.weak}`,
    borderRadius: theme.shape.radius.default,
    boxShadow: theme.shadows.z2,
    color: theme.colors.text.primary,
  };
}

/** Active Fluent command: neutral wash, no brand underline. */
export function getFluentActiveChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    background: theme.colors.action.selected,
    color: theme.colors.text.primary,
    boxShadow: 'none' as const,
  };
}

/** DetailsList header and row washes for tables outside TableNG. */
export function getFluentDetailsListChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    headerBackground: theme.colors.background.secondary,
    headerColor: theme.colors.text.secondary,
    headerWeight: theme.typography.fontWeightMedium,
    headerBorder: `1px solid ${theme.colors.border.medium}`,
    rowHover: theme.components.table.rowHoverBackground,
  };
}

/** Grouped-list header: semibold primary label, hairline rule, neutral hover. */
export function getFluentGroupHeaderChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    borderBottom: `1px solid ${theme.colors.border.weak}`,
    hoverBackground: theme.colors.action.hover,
    labelColor: theme.colors.text.primary,
    labelFontSize: theme.typography.body.fontSize,
    labelFontWeight: theme.typography.fontWeightMedium,
    radius: theme.shape.radius.default,
  };
}

export function getButtonFocusStyles(theme: GrafanaTheme2) {
  return {
    ...getFocusStyles(theme),
    transitionProperty: undefined,
  };
}

// max-width is set up based on .grafana-tooltip class that's used in dashboard
export const getTooltipContainerStyles = (theme: GrafanaTheme2) => ({
  overflow: 'hidden',
  background: theme.colors.background.elevated,
  boxShadow: theme.shadows.z2,
  maxWidth: '800px',
  padding: theme.spacing(1),
  borderRadius: hasSolidBrandGradient(theme) ? theme.shape.radius.default : theme.shape.radius.lg,
  border: hasSolidBrandGradient(theme) ? `1px solid ${theme.colors.border.weak}` : undefined,
  zIndex: theme.zIndex.tooltip,
});

/**
 * `pill`/`circle` are excluded as they aren't meaningful inside the relative radius calculations.
 */
type RadiusToken = keyof Omit<Radii, 'pill' | 'circle'>;

/**
 * Parses a radius value (either a number or a radius token) to a CSS string.
 */
const parseRadius = (theme: GrafanaTheme2, radius?: number | RadiusToken): string => {
  if (radius === undefined) {
    return theme.shape.radius.default;
  }
  return typeof radius === 'number' ? `${radius}px` : theme.shape.radius[radius];
};

interface ExternalRadiusAdditionalOptions {
  selfBorderWidth?: number;
  childBorderRadius?: number | RadiusToken;
}
/**
 * Calculates a border radius for an element, based on border radius of its child.
 *
 * @param theme
 * @param offset - The distance to offset from the child element, should be >= 0.
 * @param additionalOptions
 * @param additionalOptions.selfBorderWidth - The border width of the element itself (default: 1)
 * @param additionalOptions.childBorderRadius - The border radius of the child element, either a px number or a radius token name ('default' | 'md' | 'sm' | 'lg') (default: theme default radius)
 * @returns A CSS calc() expression that returns the relative external radius value
 */
export const getExternalRadius = (
  theme: GrafanaTheme2,
  offset: number,
  additionalOptions: ExternalRadiusAdditionalOptions = {}
) => {
  const { selfBorderWidth = 1, childBorderRadius } = additionalOptions;

  return `calc(max(0px, ${parseRadius(theme, childBorderRadius)} + ${offset}px + ${selfBorderWidth}px))`;
};

interface InternalRadiusAdditionalOptions {
  parentBorderWidth?: number;
  parentBorderRadius?: number | RadiusToken;
}

/**
 * Calculates a border radius for an element, based on border radius of its parent.
 *
 * @param theme
 * @param offset - The distance to offset from the parent element, should be >= 0.
 * @param additionalOptions
 * @param additionalOptions.parentBorderWidth - The border width of the parent element (default: 1)
 * @param additionalOptions.parentBorderRadius - The border radius of the parent element, either a px number or a radius token name ('default' | 'md' | 'sm' | 'lg') (default: theme default radius)
 * @returns A CSS calc() expression that returns the relative internal radius value
 */
export const getInternalRadius = (
  theme: GrafanaTheme2,
  offset: number,
  additionalOptions: InternalRadiusAdditionalOptions = {}
) => {
  const { parentBorderWidth = 1, parentBorderRadius } = additionalOptions;

  return `calc(max(0px, ${parseRadius(theme, parentBorderRadius)} - ${offset}px - ${parentBorderWidth}px))`;
};
