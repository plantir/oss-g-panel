import { css } from '@emotion/css';
import { useFocusRing } from '@react-aria/focus';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { getFocusStyles } from '../../themes/mixins';

/** @internal */
export enum ColorSwatchVariant {
  Small = 'small',
  Large = 'large',
}

/** @internal */
export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  label?: string;
  variant?: ColorSwatchVariant;
  isSelected?: boolean;
}

/** @internal */
export const ColorSwatch = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      color,
      label,
      variant = ColorSwatchVariant.Small,
      isSelected,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      id,
      ...otherProps
    },
    ref
  ) => {
    const theme = useTheme2();
    const { isFocusVisible, focusProps } = useFocusRing();
    const styles = getStyles(theme, variant, color, isFocusVisible, isSelected);
    const hasLabel = !!label;
    const colorLabel = ariaLabel || label;
    return (
      <div ref={ref} className={styles.wrapper} data-testid={selectors.components.ColorSwatch.name} {...otherProps}>
        {hasLabel && <span className={styles.label}>{label}</span>}
        <button
          id={id}
          className={styles.swatch}
          {...focusProps}
          aria-label={
            colorLabel
              ? t('grafana-ui.color-swatch.aria-label-selected-color', '{{colorLabel}} color', { colorLabel })
              : t('grafana-ui.color-swatch.aria-label-default', 'Pick a color')
          }
          aria-describedby={ariaDescribedBy}
          type="button"
        />
      </div>
    );
  }
);

/** Brand ring around a selected Fluent swatch. Undefined on other themes. */
export function getFluentSwatchSelection(theme: GrafanaTheme2, isSelected?: boolean) {
  if (!hasSolidBrandGradient(theme) || !isSelected) {
    return undefined;
  }

  return `0 0 0 2px ${theme.colors.background.elevated}, 0 0 0 4px ${theme.colors.primary.main}`;
}

const getStyles = (
  theme: GrafanaTheme2,
  variant: ColorSwatchVariant,
  color: string,
  isFocusVisible: boolean,
  isSelected?: boolean
) => {
  const tc = tinycolor(color);
  const isSmall = variant === ColorSwatchVariant.Small;
  const swatchSize = isSmall ? '16px' : '32px';
  const fluent = hasSolidBrandGradient(theme);
  const fluentSelection = getFluentSwatchSelection(theme, isSelected);
  const focus = getFocusStyles(theme);
  let border = 'none';

  if (tc.getAlpha() < 0.1) {
    border = `2px solid ${theme.colors.border.medium}`;
  }

  return {
    wrapper: css({
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    }),
    label: css({
      marginRight: theme.spacing(1),
    }),
    swatch: css({
      width: swatchSize,
      height: swatchSize,
      background: `${color}`,
      border,
      borderRadius: fluent ? theme.shape.radius.default : theme.shape.radius.circle,
      outlineOffset: fluent ? focus.outlineOffset : '1px',
      outline: isFocusVisible ? (fluent ? focus.outline : `2px solid  ${theme.colors.primary.main}`) : 'none',
      boxShadow: fluentSelection
        ? fluentSelection
        : isSelected
          ? `inset 0 0 0 2px ${color}, inset 0 0 0 4px ${theme.colors.getContrastText(color)}`
          : 'none',
      ...(!fluent && {
        [theme.transitions.handleMotion('no-preference')]: {
          transition: theme.transitions.create(['transform'], {
            duration: theme.transitions.duration.short,
          }),
        },
      }),
      '&:hover': fluent
        ? {
            boxShadow: fluentSelection ?? `0 0 0 1px ${theme.colors.border.strong}`,
          }
        : {
            transform: 'scale(1.1)',
          },
      '@media (forced-colors: active)': {
        forcedColorAdjust: 'none',
      },
    }),
  };
};

ColorSwatch.displayName = 'ColorSwatch';
