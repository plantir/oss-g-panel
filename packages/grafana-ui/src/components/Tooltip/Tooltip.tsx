import { css, cx } from '@emotion/css';
import {
  arrow,
  autoUpdate,
  FloatingArrow,
  offset,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  safePolygon,
} from '@floating-ui/react';
import { forwardRef, cloneElement, isValidElement, useCallback, useId, useRef, useState, type JSX } from 'react';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { useStyles2, useTheme2 } from '../../themes/ThemeContext';
import { getFluentTooltipChrome } from '../../themes/mixins';
import { getPositioningMiddleware } from '../../utils/floating';
import { buildTooltipTheme, getPlacement } from '../../utils/tooltipUtils';
import { Portal } from '../Portal/Portal';

import { type PopoverContent, type TooltipPlacement } from './types';

export interface TooltipProps {
  theme?: 'info' | 'error' | 'info-alt';
  show?: boolean;
  placement?: TooltipPlacement;
  content: PopoverContent;
  children: JSX.Element;
  /**
   * Set to true if you want the tooltip to stay long enough so the user can move mouse over content to select text or click a link
   */
  interactive?: boolean;
}

/**
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/overlays-tooltip--docs
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  ({ children, theme: tooltipTheme, interactive, show, placement, content }, forwardedRef) => {
    const grafanaTheme = useTheme2();
    const fluent = hasSolidBrandGradient(grafanaTheme);
    const arrowRef = useRef(null);
    const [controlledVisible, setControlledVisible] = useState(show);
    const isOpen = show ?? controlledVisible;
    const floatingUIPlacement = getPlacement(placement);

    // the order of middleware is important!
    // `arrow` should almost always be at the end
    // see https://floating-ui.com/docs/arrow#order
    const middleware = [
      offset(fluent ? 4 : 8),
      ...getPositioningMiddleware(floatingUIPlacement),
      ...(fluent
        ? []
        : [
            arrow({
              element: arrowRef,
              padding: 12,
            }),
          ]),
    ];

    const { context, refs, floatingStyles } = useFloating({
      open: isOpen,
      placement: floatingUIPlacement,
      onOpenChange: setControlledVisible,
      middleware,
      whileElementsMounted: autoUpdate,
    });
    const tooltipId = useId();

    const hover = useHover(context, {
      handleClose: interactive ? safePolygon() : undefined,
      move: false,
    });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, focus]);

    const contentIsFunction = typeof content === 'function';

    const styles = useStyles2(getStyles);
    const style = styles[tooltipTheme ?? 'info'];

    const handleRef = useCallback(
      (ref: HTMLElement | null) => {
        refs.setReference(ref);

        if (typeof forwardedRef === 'function') {
          forwardedRef(ref);
        } else if (forwardedRef) {
          forwardedRef.current = ref;
        }
      },
      [forwardedRef, refs]
    );

    // if the child has a matching aria-label, this should take precedence over the tooltip content
    // otherwise we end up double announcing things in e.g. IconButton
    const childHasMatchingAriaLabel = 'aria-label' in children.props && children.props['aria-label'] === content;

    return (
      <>
        {cloneElement(children, {
          ref: handleRef,
          tabIndex: 0, // tooltip trigger should be keyboard focusable
          'aria-describedby': !childHasMatchingAriaLabel && isOpen ? tooltipId : undefined,
          ...getReferenceProps(),
        })}
        {isOpen && (
          <Portal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              data-testid={selectors.components.Tooltip.container}
              id={tooltipId}
              role="tooltip"
              className={style.container}
              {...getFloatingProps()}
            >
              {!fluent && (
                <FloatingArrow
                  strokeWidth={0.3}
                  stroke={style.borderColor}
                  width={8}
                  height={4}
                  tipRadius={2}
                  className={style.arrow}
                  ref={arrowRef}
                  context={context}
                />
              )}
              {typeof content === 'string' && content}
              {isValidElement(content) && cloneElement(content)}
              {contentIsFunction && content({})}
            </div>
          </Portal>
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

const getStyles = (theme: GrafanaTheme2) => {
  const visualRefreshEnabled = theme.flags.visualDesignRefresh;
  const fluentTip = getFluentTooltipChrome(theme);
  const info = buildTooltipTheme(
    theme,
    theme.components.tooltip.background,
    theme.components.tooltip.background,
    theme.components.tooltip.text,
    { topBottom: 0.5, rightLeft: 1 }
  );
  const error = buildTooltipTheme(
    theme,
    fluentTip ? theme.colors.error.background : theme.colors.error[visualRefreshEnabled ? 'background' : 'main'],
    fluentTip ? theme.colors.error.border : theme.colors.error[visualRefreshEnabled ? 'border' : 'main'],
    fluentTip ? theme.colors.error.text : theme.colors.error[visualRefreshEnabled ? 'text' : 'contrastText'],
    { topBottom: 0.5, rightLeft: 1 }
  );

  if (!fluentTip) {
    return {
      info,
      ['info-alt']: info,
      error,
    };
  }

  const fluentInfo = {
    ...info,
    borderColor: theme.colors.border.weak,
    container: cx(
      info.container,
      css({
        backgroundColor: fluentTip.background,
        border: fluentTip.border,
        borderRadius: fluentTip.borderRadius,
        boxShadow: fluentTip.boxShadow,
        color: fluentTip.color,
      })
    ),
  };

  return {
    info: fluentInfo,
    ['info-alt']: fluentInfo,
    error: {
      ...error,
      container: cx(error.container, css({ borderRadius: fluentTip.borderRadius, boxShadow: fluentTip.boxShadow })),
    },
  };
};
