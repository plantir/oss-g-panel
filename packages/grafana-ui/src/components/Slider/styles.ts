import { css } from '@emotion/css';
import { css as cssCore } from '@emotion/react';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';

import '@rc-component/slider/assets/index.css';

export const getStyles = (theme: GrafanaTheme2, isHorizontal: boolean, hasMarks = false) => {
  const { spacing } = theme;
  const fluent = hasSolidBrandGradient(theme);
  const railColor = fluent ? theme.colors.border.medium : theme.colors.border.strong;
  const trackColor = theme.colors.accent.main;
  const handleColor = theme.colors.accent.main;
  const blueOpacity = theme.colors.accent.transparent;
  const hoverStyle = fluent
    ? `border-color: ${theme.colors.primary.shade || handleColor}; box-shadow: none;`
    : `box-shadow: 0px 0px 0px 6px ${blueOpacity}`;
  const focusRing = theme.isDark ? '#ffffff' : '#000000';

  return {
    container: css({
      width: '100%',
      margin: isHorizontal ? 'inherit' : spacing(1, 3, 1, 1),
      paddingBottom: isHorizontal && hasMarks ? theme.spacing(1) : 'inherit',
      height: isHorizontal ? 'auto' : '100%',
    }),
    // can't write this as an object since it needs to overwrite rc-slider styles
    // object syntax doesn't support kebab case keys
    // eslint-disable-next-line @emotion/syntax-preference
    slider: css`
      .rc-slider {
        display: flex;
        flex-grow: 1;
        margin-left: ${fluent ? '8px' : '7px'}; // half the handle, so 0 sits on the start of the rail
      }
      .rc-slider-mark {
        top: ${theme.spacing(1.75)};
      }
      .rc-slider-mark-text {
        color: ${theme.colors.text.disabled};
        font-size: ${theme.typography.bodySmall.fontSize};
      }
      .rc-slider-mark-text-active {
        color: ${theme.colors.text.primary};
      }
      .rc-slider-handle {
        border: ${fluent ? `2px solid ${handleColor}` : 'none'};
        background-color: ${fluent ? theme.colors.background.primary : handleColor};
        box-shadow: ${fluent ? 'none' : theme.shadows.z1};
        ${fluent ? 'width: 16px; height: 16px; margin-top: -6px;' : ''}
        cursor: pointer;
        opacity: 1;
      }

      .rc-slider-handle:hover,
      .rc-slider-handle:active,
      .rc-slider-handle-click-focused:focus {
        ${hoverStyle};
      }

      // The triple class names is needed because that's the specificity used in the source css :(
      .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging,
      .rc-slider-handle:focus-visible {
        ${
          fluent
            ? `box-shadow: none; outline: 2px solid ${focusRing}; outline-offset: 2px;`
            : `box-shadow: 0 0 0 5px ${theme.colors.text.primary};`
        }
      }

      ${
        fluent
          ? `.rc-slider-rail, .rc-slider-track { height: 4px; border-radius: ${theme.shape.radius.pill}; }`
          : ''
      }

      .rc-slider-dot,
      .rc-slider-dot-active {
        background-color: ${theme.colors.text.primary};
        border-color: ${theme.colors.text.primary};
      }

      .rc-slider-track {
        background-color: ${trackColor};
      }
      .rc-slider-rail {
        background-color: ${railColor};
        cursor: pointer;
      }
    `,
    /** Global component from @emotion/core doesn't accept computed classname string returned from css from emotion.
     * It accepts object containing the computed name and flattened styles returned from css from @emotion/core
     * */
    tooltip: cssCore`
      body {
        .rc-slider-tooltip {
          cursor: grab;
          user-select: none;
          z-index: ${theme.zIndex.tooltip};
        }

        .rc-slider-tooltip-inner {
          color: ${theme.colors.text.primary};
          background-color: transparent !important;
          border-radius: 0;
          box-shadow: none;
        }

        .rc-slider-tooltip-placement-top .rc-slider-tooltip-arrow {
          display: none;
        }

        .rc-slider-tooltip-placement-top {
          padding: 0;
        }
      }
    `,
    sliderInput: css({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    }),
    sliderInputVertical: css({
      flexDirection: 'column',
      height: '100%',

      '.rc-slider': {
        margin: 0,
        order: 2,
      },
    }),
    sliderInputField: css({
      marginLeft: theme.spacing(3),
      input: {
        textAlign: 'center',
      },
    }),
    sliderInputFieldVertical: css({
      margin: `0 0 ${theme.spacing(3)} 0`,
      order: 1,
    }),
  };
};
