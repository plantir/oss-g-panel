import { css, cx } from '@emotion/css';
import * as React from 'react';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';

import { useStyles2 } from '../../themes/ThemeContext';
import { type IconName } from '../../types/icon';
import { clearButtonStyles } from '../Button/Button';
import { Icon } from '../Icon/Icon';

export interface FilterPillProps {
  selected: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  icon?: IconName;
}

/**
 * A component used for quick toggling on/off filters. Mostly used in inline form components and transformation/query editors.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-filterpill--docs
 */
export const FilterPill = ({ label, selected, onClick, icon = 'check' }: FilterPillProps) => {
  const styles = useStyles2(getStyles);
  const clearButton = useStyles2(clearButtonStyles);
  return (
    <button
      aria-pressed={selected}
      type="button"
      className={cx(clearButton, styles.wrapper, selected && styles.selected)}
      onClick={onClick}
    >
      <span>{label}</span>
      {selected && <Icon name={icon} className={styles.icon} data-testid="filter-pill-icon" />}
    </button>
  );
};

/** Neutral Fluent chip. Stock themes keep the pill. */
export function getFilterPillChrome(theme: GrafanaTheme2, selected: boolean) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    borderRadius: theme.shape.radius.default,
    borderColor: selected ? theme.colors.border.strong : theme.colors.border.medium,
    background: selected ? theme.colors.action.selected : theme.colors.background.secondary,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.colors.text.primary,
  };
}

const getStyles = (theme: GrafanaTheme2) => {
  const resting = getFilterPillChrome(theme, false);
  const selectedChrome = getFilterPillChrome(theme, true);

  return {
    wrapper: css({
      background: resting?.background ?? theme.colors.background.secondary,
      borderRadius: resting?.borderRadius ?? theme.shape.radius.pill,
      padding: theme.spacing(0, 2),
      fontSize: theme.typography.bodySmall.fontSize,
      fontWeight: resting?.fontWeight ?? theme.typography.fontWeightMedium,
      lineHeight: theme.typography.bodySmall.lineHeight,
      color: resting?.color ?? theme.colors.text.secondary,
      display: 'flex',
      alignItems: 'center',
      height: '32px',
      position: 'relative',
      border: resting ? `1px solid ${resting.borderColor}` : `1px solid ${theme.colors.background.secondary}`,
      whiteSpace: 'nowrap',

      '&:hover': {
        background: theme.colors.action.hover,
        color: theme.colors.text.primary,
      },
    }),
    selected: css({
      color: theme.colors.text.primary,
      background: selectedChrome?.background ?? theme.colors.action.selected,
      border: selectedChrome
        ? `1px solid ${selectedChrome.borderColor}`
        : `1px solid ${theme.colors.action.selectedBorder}`,

      '&:hover': {
        background: selectedChrome ? theme.colors.action.hover : theme.colors.action.focus,
      },
    }),
    icon: css({
      marginLeft: theme.spacing(0.5),
    }),
  };
};
