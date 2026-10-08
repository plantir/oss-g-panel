import { cx, css } from '@emotion/css';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';

import { useStyles2, useTheme2 } from '../../themes/ThemeContext';
import { type IconSize, isIconSize } from '../../types/icon';
import { spin } from '../../utils/keyframes';
import { Icon } from '../Icon/Icon';
import { getIconRoot, getIconSubDir, getSvgSize } from '../Icon/utils';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
  inline?: boolean;
  size?: IconSize;
}

/**
 * @deprecated
 * use a predefined size, e.g. 'md' or 'lg' instead
 */
interface PropsWithDeprecatedSize extends Omit<Props, 'size'> {
  size?: number | string;
}

/**
 * @public
 *
 * Spinner is `fa-spinner` icon animated. It is used to alert a user to wait for an activity to complete.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-spinner--docs
 */
/** Rounded brand arc used by the Fluent spinner. `size` is the outer box in px. */
export function getFluentSpinnerArc(size: number) {
  const stroke = size >= 32 ? 3 : size >= 20 ? 2 : 1.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.28;

  return {
    stroke,
    radius,
    dasharray: `${arcLength} ${circumference - arcLength}`,
  };
}

function fluentPixelSize(size: number | string): number | undefined {
  if (typeof size === 'string' && isIconSize(size)) {
    return getSvgSize(size);
  }
  if (typeof size === 'number' && Number.isFinite(size)) {
    return size;
  }
  if (typeof size === 'string') {
    const match = /^(\d+(?:\.\d+)?)px$/.exec(size.trim());
    if (match) {
      return Number(match[1]);
    }
  }
  return undefined;
}

const FluentSpinnerGlyph = ({ size, className }: { size: number; className?: string }) => {
  const arc = getFluentSpinnerArc(size);
  const center = size / 2;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      role="progressbar"
      aria-label={t('grafana-ui.spinner.aria-label', 'Loading')}
    >
      <circle
        cx={center}
        cy={center}
        r={arc.radius}
        stroke="currentColor"
        strokeWidth={arc.stroke}
        strokeLinecap="round"
        strokeDasharray={arc.dasharray}
      />
    </svg>
  );
};

export const Spinner = ({
  className,
  inline = false,
  iconClassName,
  style,
  size = 'md',
}: Props | PropsWithDeprecatedSize) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const deprecatedStyles = useStyles2(getDeprecatedStyles, size);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const iconName = prefersReducedMotion ? 'hourglass' : 'spinner';
  const pixelSize = fluentPixelSize(size);

  if (hasSolidBrandGradient(theme) && !prefersReducedMotion && pixelSize !== undefined) {
    return (
      <div
        data-testid="Spinner"
        style={style}
        className={cx(
          {
            [styles.inline]: inline,
          },
          className
        )}
      >
        <FluentSpinnerGlyph size={pixelSize} className={cx(styles.spin, iconClassName)} />
      </div>
    );
  }

  // this entire if statement is handling the deprecated size prop
  // TODO remove once we fully remove the deprecated type
  if (typeof size !== 'string' || !isIconSize(size)) {
    const iconRoot = getIconRoot();
    const subDir = getIconSubDir(iconName, 'default');
    const svgPath = `${iconRoot}${subDir}/${iconName}.svg`;
    return (
      <div
        data-testid="Spinner"
        style={style}
        className={cx(
          {
            [styles.inline]: inline,
          },
          deprecatedStyles.wrapper,
          className
        )}
      >
        <SVG
          src={svgPath}
          width={size}
          height={size}
          className={cx(styles.spin, deprecatedStyles.icon, className)}
          style={style}
        />
      </div>
    );
  }

  return (
    <div
      data-testid="Spinner"
      style={style}
      className={cx(
        {
          [styles.inline]: inline,
        },
        className
      )}
    >
      <Icon
        className={cx(styles.spin, iconClassName)}
        name={iconName}
        size={size}
        aria-label={t('grafana-ui.spinner.aria-label', 'Loading')}
      />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  inline: css({
    display: 'inline-block',
    lineHeight: 0,
  }),
  spin: css({
    ...(hasSolidBrandGradient(theme) && {
      color: theme.colors.primary.main,
      display: 'block',
    }),
    [theme.transitions.handleMotion('no-preference')]: {
      animation: `${spin} ${hasSolidBrandGradient(theme) ? '1.5s' : '2s'} infinite linear`,
    },
  }),
});

// TODO remove once we fully remove the deprecated type
const getDeprecatedStyles = (theme: GrafanaTheme2, size: number | string) => ({
  wrapper: css({
    fontSize: typeof size === 'string' ? size : `${size}px`,
  }),
  icon: css({
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    label: 'Icon',
    // line-height: 0; is needed for correct icon alignment in Safari
    lineHeight: 0,
    verticalAlign: 'middle',
  }),
});
