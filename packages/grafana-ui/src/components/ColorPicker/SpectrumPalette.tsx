import { css } from '@emotion/css';
import { useId, useMemo, useState } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';
import { useThrottleFn } from 'react-use';
import tinycolor from 'tinycolor2';

import { hasSolidBrandGradient, type GrafanaTheme2, colorManipulator } from '@grafana/data';
import { t } from '@grafana/i18n';

import { useStyles2, useTheme2 } from '../../themes/ThemeContext';
import { Field } from '../Forms/Field';
import { Stack } from '../Layout/Stack/Stack';

import ColorInput from './ColorInput';

interface SpectrumPaletteProps {
  color: string;
  onChange: (color: string) => void;
}

const SpectrumPalette = ({ color, onChange }: SpectrumPaletteProps) => {
  const [currentColor, setColor] = useState(color);
  const colorInputId = useId();

  useThrottleFn(
    (c) => {
      onChange(colorManipulator.asHexString(theme.visualization.getColorByName(c)));
    },
    500,
    [currentColor]
  );

  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const rgbaString = useMemo(() => {
    return currentColor.startsWith('rgba')
      ? currentColor
      : tinycolor(theme.visualization.getColorByName(color)).toRgbString();
  }, [currentColor, theme, color]);

  return (
    <Stack direction="column" grow={1} gap={2}>
      <RgbaStringColorPicker className={styles.root} color={rgbaString} onChange={setColor} />
      <Field noMargin label={t('grafana-ui.color-picker.input-label', 'RGBA value')}>
        <ColorInput id={colorInputId} color={rgbaString} onChange={setColor} />
      </Field>
    </Stack>
  );
};

/** Separated 4px color panel, thin sliders, and a white-ring thumb. */
export function getFluentSpectrumChrome(theme: GrafanaTheme2) {
  if (!hasSolidBrandGradient(theme)) {
    return undefined;
  }

  return {
    gap: theme.spacing(1),
    radius: theme.shape.radius.default,
    sliderHeight: theme.spacing(1),
    thumbSize: theme.spacing(2),
    thumbBorder: '2px solid #ffffff',
  };
}

export const getStyles = (theme: GrafanaTheme2) => {
  const fluent = getFluentSpectrumChrome(theme);

  return {
    root: css({
      '&.react-colorful': {
        width: 'auto',
        ...(fluent && { gap: fluent.gap }),
      },

      '.react-colorful': {
        '&__saturation': {
          borderRadius: fluent ? fluent.radius : `${theme.shape.radius.default} ${theme.shape.radius.default} 0 0`,
        },
        '&__hue': {
          ...(fluent && {
            borderRadius: fluent.radius,
            overflow: 'visible',
          }),
        },
        '&__alpha': {
          borderRadius: fluent ? fluent.radius : `0 0 ${theme.shape.radius.default} ${theme.shape.radius.default}`,
          ...(fluent && { overflow: 'visible' }),
        },
        '&__alpha, &__hue': {
          height: fluent ? fluent.sliderHeight : theme.spacing(2),
          position: 'relative',
        },
        '&__pointer': {
          height: fluent ? fluent.thumbSize : theme.spacing(2),
          width: fluent ? fluent.thumbSize : theme.spacing(2),
          ...(fluent && {
            border: fluent.thumbBorder,
            borderRadius: theme.shape.radius.circle,
            boxShadow: 'none',
            boxSizing: 'border-box',
          }),
        },
      },
    }),
  };
};

export default SpectrumPalette;
