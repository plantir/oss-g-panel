import { css, cx } from '@emotion/css';
import { forwardRef, type ForwardedRef, type HTMLProps, type ReactNode, useContext, useRef } from 'react';
import { useMeasure } from 'react-use';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { stylesFactory } from '../../themes/stylesFactory';
import { useFieldContext } from '../Forms/FieldContext';
import { getFocusStyle, sharedInputStyle } from '../Forms/commonStyles';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';

import { AutoSizeInputContext } from './AutoSizeInputContext';

export interface Props extends Omit<HTMLProps<HTMLInputElement>, 'prefix' | 'size'> {
  /** Sets the width to a multiple of 8px. Should only be used with inline forms. Setting width of the container is preferred in other cases.*/
  width?: number;
  /** Show an invalid state around the input */
  invalid?: boolean;
  /** Show an icon as a prefix in the input */
  prefix?: ReactNode;
  /** Show an icon as a suffix in the input */
  suffix?: ReactNode;
  /** Show a loading indicator as a suffix in the input */
  loading?: boolean;
  /** Add a component as an addon before the input  */
  addonBefore?: ReactNode;
  /** Add a component as an addon after the input */
  addonAfter?: ReactNode;
}

interface StyleDeps {
  theme: GrafanaTheme2;
  invalid?: boolean;
  width?: number;
}

/**
 * Used for regular text input. For an array of data or tree-structured data, consider using `Combobox` or `Cascader` respectively.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-input--docs
 */
export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    className,
    addonAfter,
    addonBefore,
    prefix,
    suffix: suffixProp,
    invalid: invalidProp,
    loading: loadingProp,
    width = 0,
    id: idProp,
    disabled: disabledProp,
    'aria-describedby': ariaDescribedByProp,
    'aria-labelledby': ariaLabelledByProp,
    ...restProps
  } = props;

  const fieldContext = useFieldContext();
  const invalid = invalidProp ?? fieldContext.invalid;
  const loading = loadingProp ?? fieldContext.loading;
  const id = idProp ?? fieldContext.id;
  const disabled = disabledProp ?? fieldContext.disabled;
  const ariaDescribedBy = ariaDescribedByProp ?? fieldContext['aria-describedby'];
  const ariaLabelledBy = ariaLabelledByProp ?? fieldContext['aria-labelledby'];
  /**
   * Prefix & suffix are positioned absolutely within inputWrapper. We use client rects below to apply correct padding to the input
   * when prefix/suffix is larger than default (28px = 16px(icon) + 12px(left/right paddings)).
   * Thanks to that prefix/suffix do not overflow the input element itself.
   */
  const [prefixRef, prefixRect] = useMeasure<HTMLDivElement>();
  const [suffixRef, suffixRect] = useMeasure<HTMLDivElement>();

  // Yes, this is gross - When Input is being wrapped by AutoSizeInput, add the suffix/prefix width to the overall width
  // so the text content is not clipped. The intention is to make all the input's text appear without overflow/clipping,
  // which isn't normally how width is used in this component.
  // This behaviour is not controlled via a prop so we can limit API surface, and remove this as a 'breaking change' later
  // if a better solution is found.
  const isInAutoSizeInput = useContext(AutoSizeInputContext);
  const accessoriesWidth = (prefixRect.width || 0) + (suffixRect.width || 0);
  const autoSizeWidth = isInAutoSizeInput && width ? width + accessoriesWidth / 8 : undefined;

  const theme = useTheme2();
  const fluent = hasSolidBrandGradient(theme);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Don't pass the width prop, as this causes an unnecessary amount of Emotion calls when auto sizing
  const styles = getInputStyles({ theme, invalid: !!invalid, width: autoSizeWidth ? undefined : width });

  const suffix = suffixProp || (loading && <Spinner inline={true} />);
  const showSteppers = fluent && restProps.type === 'number' && !suffix;
  const steppersLocked = Boolean(disabled || restProps.readOnly);

  return (
    <div
      className={cx(styles.wrapper, className)}
      // If the component is in an AutoSizeInput, set the width here to prevent emotion doing stuff
      // on every keypress
      style={autoSizeWidth ? { width: theme.spacing(autoSizeWidth) } : undefined}
      data-testid="input-wrapper"
    >
      {!!addonBefore && <div className={styles.addon}>{addonBefore}</div>}
      <div className={styles.inputWrapper}>
        {prefix && (
          <div className={styles.prefix} ref={prefixRef}>
            {prefix}
          </div>
        )}

        <input
          ref={(node) => {
            inputRef.current = node;
            assignInputRef(ref, node);
          }}
          className={styles.input}
          aria-invalid={!!invalid}
          id={id}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          {...restProps}
          onWheel={
            restProps.type === 'number'
              ? (e) => {
                  e.currentTarget.blur();
                  restProps.onWheel?.(e);
                }
              : restProps.onWheel
          }
          style={{
            paddingLeft: prefix ? prefixRect.width + 12 : undefined,
            paddingRight: showSteppers ? 36 : suffix || loading ? suffixRect.width + 12 : undefined,
          }}
        />

        {showSteppers && (
          <div className={styles.spinColumn}>
            <button
              type="button"
              className={styles.spinButton}
              aria-label={t('grafana-ui.input.increase-value', 'Increase value')}
              disabled={steppersLocked || isNumberBoundReached(restProps.value, restProps.max, 1)}
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => inputRef.current && stepNumberInput(inputRef.current, 1)}
            >
              <Icon name="angle-up" size="xs" />
            </button>
            <button
              type="button"
              className={cx(styles.spinButton, styles.spinButtonDown)}
              aria-label={t('grafana-ui.input.decrease-value', 'Decrease value')}
              disabled={steppersLocked || isNumberBoundReached(restProps.value, restProps.min, -1)}
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => inputRef.current && stepNumberInput(inputRef.current, -1)}
            >
              <Icon name="angle-down" size="xs" />
            </button>
          </div>
        )}

        {suffix && (
          <div className={styles.suffix} ref={suffixRef}>
            {suffix}
          </div>
        )}
      </div>
      {!!addonAfter && <div className={styles.addon}>{addonAfter}</div>}
    </div>
  );
});

Input.displayName = 'Input';

function assignInputRef(ref: ForwardedRef<HTMLInputElement>, node: HTMLInputElement | null) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}

export function isNumberBoundReached(
  value: HTMLProps<HTMLInputElement>['value'],
  bound: HTMLProps<HTMLInputElement>['min'],
  direction: 1 | -1
) {
  if (value === undefined || value === '' || Array.isArray(value) || bound === undefined || bound === '') {
    return false;
  }

  const current = Number(value);
  const limit = Number(bound);
  if (Number.isNaN(current) || Number.isNaN(limit)) {
    return false;
  }

  return direction > 0 ? current >= limit : current <= limit;
}

function nextSteppedValue(input: HTMLInputElement, direction: 1 | -1) {
  const step = input.step === '' || input.step === 'any' ? 1 : Number(input.step);
  if (!Number.isFinite(step) || step <= 0) {
    return undefined;
  }

  const min = input.min === '' ? undefined : Number(input.min);
  const max = input.max === '' ? undefined : Number(input.max);
  const current = input.value === '' || Number.isNaN(Number(input.value)) ? 0 : Number(input.value);
  let next = current + direction * step;
  const places = (String(step).split('.')[1] ?? '').length;
  next = Number(next.toFixed(Math.min(places, 20)));

  if (min !== undefined && Number.isFinite(min) && next < min) {
    if (direction < 0) {
      return undefined;
    }
    next = min;
  }
  if (max !== undefined && Number.isFinite(max) && next > max) {
    return undefined;
  }
  if (next === current) {
    return undefined;
  }

  return String(next);
}

/** Steps a number input and notifies React. Native steppers throw when step is "any". */
export function stepNumberInput(input: HTMLInputElement, direction: 1 | -1) {
  if (input.disabled || input.readOnly) {
    return;
  }

  const previous = input.value;
  try {
    if (direction > 0) {
      input.stepUp();
    } else {
      input.stepDown();
    }
  } catch {
    // step="any" has no native step.
  }

  if (input.value === previous) {
    const next = nextSteppedValue(input, direction);
    if (next === undefined) {
      return;
    }
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, next);
  }

  if (input.value === previous) {
    return;
  }

  const tracker = Object.getOwnPropertyDescriptor(input, '_valueTracker')?.value;
  if (isValueTracker(tracker)) {
    tracker.setValue(previous);
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function isValueTracker(value: unknown): value is { setValue: (next: string) => void } {
  return typeof value === 'object' && value !== null && 'setValue' in value && typeof value.setValue === 'function';
}

export const getInputStyles = stylesFactory(({ theme, invalid = false, width }: StyleDeps) => {
  const fluent = hasSolidBrandGradient(theme);
  const prefixSuffixStaticWidth = '28px';
  const prefixSuffix = css({
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: theme.typography.size.md,
    height: '100%',
    /* Min width specified for prefix/suffix classes used outside React component*/
    minWidth: prefixSuffixStaticWidth,
    color: theme.colors.text.secondary,
  });

  return {
    // Wraps inputWrapper and addons
    wrapper: cx(
      css({
        label: 'input-wrapper',
        display: 'flex',
        width: width ? theme.spacing(width) : '100%',
        height: theme.spacing(theme.components.height.md),
        borderRadius: theme.shape.radius.default,
        ...(fluent && {
          "input[type='number']": {
            appearance: 'textfield',
            MozAppearance: 'textfield',
          },
          "input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button": {
            WebkitAppearance: 'none',
            margin: 0,
          },
        }),
        '&:hover': {
          '> .prefix, .suffix, .input': {
            borderColor: invalid ? theme.colors.error.border : theme.colors.primary.border,
          },

          // only show number buttons on hover
          ...(!fluent && {
            "input[type='number']": {
              appearance: 'textfield',
            },

            "input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button": {
              // Need type assertion here due to the use of !important
              // see https://github.com/frenic/csstype/issues/114#issuecomment-697201978
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              WebkitAppearance: 'inner-spin-button !important' as 'inner-spin-button',
              opacity: 1,
            },
          }),
        },
      })
    ),
    // Wraps input and prefix/suffix
    inputWrapper: css({
      label: 'input-inputWrapper',
      position: 'relative',
      flexGrow: 1,
      /* we want input to be above addons, especially for focused state */
      zIndex: 1,

      /* when input rendered with addon before only*/
      '&:not(:first-child):last-child': {
        '> input': {
          borderLeft: 'none',
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
      },

      /* when input rendered with addon after only*/
      '&:first-child:not(:last-child)': {
        '> input': {
          borderRight: 'none',
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
        },
      },

      /* when rendered with addon before and after */
      '&:not(:first-child):not(:last-child)': {
        '> input': {
          borderRight: 'none',
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
      },

      input: {
        /* paddings specified for classes used outside React component */
        '&:not(:first-child)': {
          paddingLeft: prefixSuffixStaticWidth,
        },
        '&:not(:last-child)': {
          paddingRight: prefixSuffixStaticWidth,
        },
        '&[readonly]': {
          cursor: 'default',
        },
      },
    }),

    input: cx(
      getFocusStyle(theme),
      sharedInputStyle(theme, invalid),
      css({
        label: 'input-input',
        position: 'relative',
        zIndex: 0,
        flexGrow: 1,
        borderRadius: theme.shape.radius.default,
        height: '100%',
        width: '100%',
      })
    ),
    inputDisabled: css({
      backgroundColor: theme.colors.action.disabledBackground,
      color: theme.colors.action.disabledText,
      border: `1px solid ${theme.colors.action.disabledBackground}`,
      '&:focus': {
        boxShadow: 'none',
      },
    }),
    addon: css({
      label: 'input-addon',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 0,
      flexShrink: 0,
      position: 'relative',

      '&:first-child': {
        borderTopRightRadius: 'unset',
        borderBottomRightRadius: 'unset',
        '> :last-child': {
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
        },
      },

      '&:last-child': {
        borderTopLeftRadius: 'unset',
        borderBottomLeftRadius: 'unset',
        '> :first-child': {
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
      },
      '> *:focus': {
        /* we want anything that has focus and is an addon to be above input */
        zIndex: 2,
      },
    }),
    prefix: cx(
      prefixSuffix,
      css({
        label: 'input-prefix',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(0.5),
        borderRight: 'none',
        borderTopRightRadius: 'unset',
        borderBottomRightRadius: 'unset',
      })
    ),
    spinColumn: css({
      label: 'input-spinColumn',
      position: 'absolute',
      top: 1,
      right: 1,
      bottom: 1,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: 24,
      overflow: 'hidden',
      borderLeft: `1px solid ${theme.colors.border.medium}`,
      borderTopRightRadius: `calc(${theme.shape.radius.default} - 1px)`,
      borderBottomRightRadius: `calc(${theme.shape.radius.default} - 1px)`,
    }),
    spinButton: css({
      label: 'input-spinButton',
      appearance: 'none',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      border: 'none',
      background: 'transparent',
      color: theme.colors.text.secondary,
      cursor: 'pointer',

      '&:hover:not(:disabled)': {
        background: theme.colors.action.hover,
        color: theme.colors.text.primary,
      },

      '&:disabled': {
        color: theme.colors.text.disabled,
        cursor: 'default',
      },
    }),
    spinButtonDown: css({
      borderTop: `1px solid ${theme.colors.border.weak}`,
    }),
    suffix: cx(
      prefixSuffix,
      css({
        label: 'input-suffix',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        borderLeft: 'none',
        borderTopLeftRadius: 'unset',
        borderBottomLeftRadius: 'unset',
        right: 0,
      })
    ),
    loadingIndicator: css({
      '& + *': {
        marginLeft: theme.spacing(0.5),
      },
    }),
  };
});
