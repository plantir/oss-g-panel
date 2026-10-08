import { css, cx } from '@emotion/css';
import { type HTMLProps, useCallback } from 'react';
import * as React from 'react';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';

import { useStyles2 } from '../../themes/ThemeContext';
import { getFocusStyles, getMouseFocusStyles } from '../../themes/mixins';

import { useFieldContext } from './FieldContext';
import { getLabelStyles } from './Label';

export interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, 'value'> {
  /** Label to display next to checkbox */
  label?: string;
  /** Description to display under the label */
  description?: string | React.ReactElement;
  /** Current value of the checkbox */
  value?: boolean;
  /** htmlValue allows to specify the input "value" attribute */
  htmlValue?: string | number;
  /** Sets the checkbox into a "mixed" state */
  indeterminate?: boolean;
  /** Show an invalid state around the input */
  invalid?: boolean;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-checkbox--docs
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      value,
      htmlValue,
      onChange,
      disabled: disabledProp,
      className,
      indeterminate,
      invalid: invalidProp,
      id: idProp,
      ...inputProps
    },
    ref
  ) => {
    const handleOnChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e);
        }
      },
      [onChange]
    );
    const fieldContext = useFieldContext();
    const id = idProp ?? fieldContext.id;
    const invalid = invalidProp ?? fieldContext.invalid;
    const disabled = disabledProp ?? fieldContext.disabled;
    const styles = useStyles2(getCheckboxStyles, invalid);

    return (
      <label className={cx(styles.wrapper, className)}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            className={cx(styles.input, indeterminate && styles.inputIndeterminate)}
            checked={value}
            disabled={disabled}
            onChange={handleOnChange}
            value={htmlValue}
            aria-invalid={!!invalid}
            id={id}
            {...inputProps}
            ref={(element) => {
              if (element && indeterminate) {
                element.indeterminate = true;
              }

              // we have to manually assign the ref since we need to modify the indeterminate property
              if (ref) {
                if (typeof ref === 'function') {
                  ref(element);
                } else {
                  ref.current = element;
                }
              }
            }}
          />
          <span className={styles.checkmark} />
        </div>
        {label && <span className={styles.label}>{label}</span>}
        {description && <span className={styles.description}>{description}</span>}
      </label>
    );
  }
);

const fluentCheckMask = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='black' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'><path d='M2.25 6.15 4.9 8.8 9.75 3.35'/></svg>"
)}")`;

const fluentCheckShape = {
  content: '""',
  position: 'absolute' as const,
  zIndex: 2,
  inset: '1px',
  width: 'auto',
  height: 'auto',
  border: 'none',
  transform: 'none',
  backgroundColor: 'transparent',
  maskImage: fluentCheckMask,
  WebkitMaskImage: fluentCheckMask,
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
};

const getCheckboxStyles = (theme: GrafanaTheme2, invalid = false) => {
  const labelStyles = getLabelStyles(theme);
  const fluent = hasSolidBrandGradient(theme);
  const checkboxSize = 2;
  const labelPadding = 1;

  const getBorderColor = (color: string) => {
    return invalid ? theme.colors.error.border : color;
  };

  return {
    wrapper: css({
      display: 'inline-grid',
      alignItems: 'center',
      columnGap: theme.spacing(labelPadding),
      // gridAutoRows is needed to prevent https://github.com/grafana/grafana/issues/68570 in safari
      gridAutoRows: 'max-content',
      position: 'relative',
      verticalAlign: 'middle',
      ...(fluent && {
        '&:hover:not(:has(input:disabled)) > div > span:after': {
          backgroundColor: theme.colors.border.strong,
        },
      }),
    }),
    input: css({
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      width: '100% !important', // global styles unset this
      height: '100%',
      opacity: 0,

      '&:focus + span, &:focus-visible + span': getFocusStyles(theme),

      '&:focus:not(:focus-visible) + span': getMouseFocusStyles(theme),

      /**
       * Using adjacent sibling selector to style checked state.
       * Primarily to limit the classes necessary to use when these classes will be used
       * for angular components styling
       * */
      '&:checked + span': {
        background: theme.components.checkbox.activeBackground,
        border: `1px solid ${getBorderColor(theme.components.checkbox.activeBackground)}`,

        '&:hover': {
          background: theme.components.checkbox.activeBackgroundHover,
          border: `1px solid ${getBorderColor(theme.components.checkbox.activeBackgroundHover)}`,
        },

        '&:after': fluent
          ? {
              ...fluentCheckShape,
              backgroundColor: theme.colors.accent.contrastText,
            }
          : {
              content: '""',
              position: 'absolute',
              zIndex: 2,
              left: theme.spacing(0.5),
              top: 0,
              width: theme.spacing(0.75),
              height: theme.spacing(1.5),
              border: `solid ${theme.colors.accent.contrastText}`,
              borderWidth: '0 3px 3px 0',
              transform: 'rotate(45deg)',
            },
      },

      '&:disabled + span': {
        backgroundColor: theme.colors.action.disabledBackground,
        cursor: 'not-allowed',
        border: `1px solid ${getBorderColor(theme.colors.action.disabledBackground)}`,

        '&:hover': {
          backgroundColor: theme.colors.action.disabledBackground,
        },

        '&:after': {
          borderColor: theme.colors.action.disabledText,
        },
      },
      ...(fluent && {
        '&:disabled:not(:checked) + span:after': {
          backgroundColor: 'transparent',
        },
        '&:disabled:checked + span:after': {
          backgroundColor: theme.colors.action.disabledText,
        },
      }),
    }),

    inputIndeterminate: css({
      '&:indeterminate + span': {
        border: `1px solid ${getBorderColor(theme.components.checkbox.activeBackground)}`,
        background: theme.components.checkbox.activeBackground,

        '&:hover': {
          background: theme.components.checkbox.activeBackgroundHover,
          border: `1px solid ${getBorderColor(theme.components.checkbox.activeBackgroundHover)}`,
        },

        '&:after': {
          content: '""',
          position: 'absolute',
          zIndex: 2,
          left: fluent ? '3px' : '2px',
          right: fluent ? '3px' : '2px',
          top: fluent ? 'calc(50% - 1px)' : 'calc(50% - 1.5px)',
          height: fluent ? '2px' : '3px',
          border: fluent ? 'none' : `1.5px solid ${theme.colors.accent.contrastText}`,
          backgroundColor: theme.colors.accent.contrastText,
          width: 'auto',
          transform: 'none',
          ...(fluent && {
            inset: 'auto',
            maskImage: 'none',
            WebkitMaskImage: 'none',
          }),
        },
      },
      "&:disabled[aria-checked='mixed'] + span": {
        backgroundColor: theme.colors.action.disabledBackground,
        border: `1px solid ${getBorderColor(theme.colors.error.transparent)}`,

        '&:after': {
          borderColor: theme.colors.action.disabledText,
          ...(fluent && {
            backgroundColor: theme.colors.action.disabledText,
          }),
        },
      },
    }),

    checkboxWrapper: css({
      display: 'flex',
      alignItems: 'center',
      gridColumnStart: 1,
      gridRowStart: 1,
    }),
    checkmark: css({
      position: 'relative' /* Checkbox should be layered on top of the invisible input so it recieves :hover */,
      zIndex: 2,
      display: 'inline-block',
      width: theme.spacing(checkboxSize),
      height: theme.spacing(checkboxSize),
      borderRadius: theme.shape.radius.sm,
      background: theme.components.input.background,
      border: `1px solid ${getBorderColor(fluent ? theme.colors.border.strong : theme.components.input.borderColor)}`,

      ...(fluent && {
        '&:after': fluentCheckShape,
        '&:hover:after': {
          backgroundColor: theme.colors.border.strong,
        },
      }),

      '&:hover': {
        cursor: 'pointer',
        borderColor: getBorderColor(fluent ? theme.colors.text.primary : theme.components.input.borderHover),
      },
    }),
    label: cx(
      labelStyles.label,
      css({
        gridColumnStart: 2,
        gridRowStart: 1,
        position: 'relative',
        zIndex: 2,
        cursor: 'pointer',
        maxWidth: 'fit-content',
        lineHeight: theme.typography.bodySmall.lineHeight,
        marginBottom: 0,
      })
    ),
    description: cx(
      labelStyles.description,
      css({
        gridColumnStart: 2,
        gridRowStart: 2,
        lineHeight: theme.typography.bodySmall.lineHeight,
        marginTop: 0 /* The margin effectively comes from the top: -2px on the label above it */,
        // Enable interacting with description when checkbox is disabled
        zIndex: 1,
      })
    ),
  };
};

Checkbox.displayName = 'Checkbox';
