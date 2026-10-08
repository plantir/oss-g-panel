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
  plus: <path d="M8 3.25v9.5M3.25 8h9.5" />,
  bars: <path d="M3 4.5h10M3 8h10M3 11.5h10" />,
  'ellipsis-v': <path strokeWidth="2.25" d="M8 3.75h.01M8 8h.01M8 12.25h.01" />,
  'info-circle': (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 7.15v3.85" />
      <path strokeWidth="2.25" d="M8 5.15h.01" />
    </>
  ),
  'question-circle': (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M6.6 6.55a1.6 1.6 0 0 1 3.05.75c0 1.2-1.65 1.45-1.65 2.5" />
      <path strokeWidth="2.25" d="M8 11.5h.01" />
    </>
  ),
  cog: (
    <>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 2.35v1.85M8 11.8v1.85M2.35 8h1.85M11.8 8h1.85M3.95 3.95l1.3 1.3M10.75 10.75l1.3 1.3M12.05 3.95l-1.3 1.3M5.25 10.75l-1.3 1.3" />
    </>
  ),
  sync: (
    <>
      <path d="M13.25 8a5.25 5.25 0 0 0-5.25-5.25 5.7 5.7 0 0 0-3.95 1.6L2.75 5.6" />
      <path d="M2.75 2.75v2.85h2.85" />
      <path d="M2.75 8a5.25 5.25 0 0 0 5.25 5.25 5.7 5.7 0 0 0 3.95-1.6l1.3-1.25" />
      <path d="M10.4 10.4h2.85v2.85" />
    </>
  ),
  save: (
    <>
      <path d="M3.25 2.75h6.7L13.25 6.05v7.2H3.25z" />
      <path d="M5.25 2.75v3.25h4.5" />
      <path d="M5.5 13.25v-3.75h5v3.75" />
    </>
  ),
  copy: (
    <>
      <rect x="6" y="6" width="7.75" height="7.75" rx="1.25" />
      <path d="M10 6V3.75c0-.7-.55-1.25-1.25-1.25H3.75c-.7 0-1.25.55-1.25 1.25v5c0 .7.55 1.25 1.25 1.25H6" />
    </>
  ),
  'trash-alt': (
    <>
      <path d="M3.25 4.5h9.5" />
      <path d="M6.25 4.5V3.15h3.5V4.5" />
      <path d="M4.6 4.5l.55 8.35h5.7l.55-8.35" />
    </>
  ),
};

export const fluentChromeIconNames = Object.keys(fluentChromeIcons).filter(isChromeIconName);

function isChromeIconName(name: string): name is IconName {
  return Object.prototype.hasOwnProperty.call(fluentChromeIcons, name);
}

export function getFluentChromeIcon(name: IconName): ReactNode | undefined {
  return fluentChromeIcons[name];
}
