import type { ReactNode } from 'react';

import type { IconName } from '../../types/icon';

/**
 * Stroke glyphs drawn in place of the matching Unicon when the theme is Fluent.
 * The icon name stays the same, so callers and plugins do not change.
 */
const fluentChromeIcons: Partial<Record<IconName, ReactNode>> = {
  'angle-down': <path d="M4.25 6.25 8 10 11.75 6.25" />,
  'angle-up': <path d="M4.25 9.75 8 6 11.75 9.75" />,
  'angle-left': <path d="M9.75 4.25 6 8 9.75 11.75" />,
  'angle-right': <path d="M6.25 4.25 10 8 6.25 11.75" />,
  times: <path d="M4.25 4.25 11.75 11.75M11.75 4.25 4.25 11.75" />,
  search: (
    <>
      <circle cx="7" cy="7" r="3.75" />
      <path d="M9.9 9.9 13.25 13.25" />
    </>
  ),
  'calendar-alt': (
    <>
      <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5" />
      <path d="M2.25 6.75h11.5M5.25 2.25v2.25M10.75 2.25v2.25" />
    </>
  ),
  check: <path d="M3 8.2 6.53 11.73 13 4.47" />,
};

export const fluentChromeIconNames = Object.keys(fluentChromeIcons) as IconName[];

export function getFluentChromeIcon(name: IconName): ReactNode | undefined {
  return fluentChromeIcons[name];
}
