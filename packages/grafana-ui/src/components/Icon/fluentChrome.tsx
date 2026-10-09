import type { ReactNode } from 'react';

import { isIconName } from '@grafana/data';

import type { IconName } from '../../types/icon';

import { fluentIconCatalog } from './fluentIconCatalog';

/**
 * Stroke glyphs drawn in place of the matching Unicon when the theme is Fluent.
 * The icon name stays the same, so callers and plugins do not change.
 * Hand-tuned glyphs win over the catalog when a name is in both.
 */
const handTunedIcons: Partial<Record<IconName, ReactNode>> = {
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
  filter: <path d="M2.75 3.25h10.5L9.4 7.85v3.4L6.6 12.7V7.85z" />,
  user: (
    <>
      <circle cx="8" cy="5.35" r="2.15" />
      <path d="M3.4 13.25c.75-2.15 2.45-3.2 4.6-3.2s3.85 1.05 4.6 3.2" />
    </>
  ),
  bell: (
    <>
      <path d="M8 2.6a3.7 3.7 0 0 0-3.7 3.7v2.15L3 11.15h10l-1.3-2.7V6.3A3.7 3.7 0 0 0 8 2.6z" />
      <path d="M6.7 12.35a1.4 1.4 0 0 0 2.6 0" />
    </>
  ),
  home: <path d="M2.6 7.15 8 2.6l5.4 4.55V13.4H9.7V9.35H6.3V13.4H2.6z" />,
  'home-alt': <path d="M2.6 7.15 8 2.6l5.4 4.55V13.4H9.7V9.35H6.3V13.4H2.6z" />,
  'clock-nine': (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 4.7V8H5.15" />
    </>
  ),
  pen: (
    <>
      <path d="m10.15 2.7 3.15 3.15-7.7 7.7H2.45V10.4z" />
      <path d="m8.6 4.25 3.15 3.15" />
    </>
  ),
  eye: (
    <>
      <path d="M1.7 8S4.15 4.2 8 4.2 14.3 8 14.3 8 11.85 11.8 8 11.8 1.7 8 1.7 8z" />
      <circle cx="8" cy="8" r="1.7" />
    </>
  ),
  link: (
    <>
      <path d="M6.7 9.3 5.15 10.85a2.15 2.15 0 0 1-3.05-3.05L3.65 6.25" />
      <path d="M9.3 6.7 10.85 5.15a2.15 2.15 0 0 1 3.05 3.05L12.35 9.75" />
      <path d="m6.2 9.8 3.6-3.6" />
    </>
  ),
  'external-link-alt': (
    <>
      <path d="M6.4 3.35H3.35v9.3h9.3V9.6" />
      <path d="M8.7 3.35h3.95v3.95" />
      <path d="M12.65 3.35 7.2 8.8" />
    </>
  ),
  'download-alt': (
    <>
      <path d="M8 2.5v7.1" />
      <path d="m5.15 7.15 2.85 2.85 2.85-2.85" />
      <path d="M3.25 13.25h9.5" />
    </>
  ),
  upload: (
    <>
      <path d="M8 10.6V3.5" />
      <path d="M5.15 6.15 8 3.3l2.85 2.85" />
      <path d="M3.25 13.25h9.5" />
    </>
  ),
  play: <path d="M5.2 3.15v9.7L12.85 8z" />,
  folder: <path d="M2.35 4.6h3.9l1.2 1.45h6.2v6.7H2.35z" />,
  database: (
    <>
      <ellipse cx="8" cy="4.2" rx="5" ry="1.7" />
      <path d="M3 4.2v7.5c0 .95 2.24 1.7 5 1.7s5-.75 5-1.7v-7.5" />
      <path d="M3 8c0 .95 2.24 1.7 5 1.7s5-.75 5-1.7" />
    </>
  ),
  'expand-arrows': (
    <>
      <path d="M8 2.2v3.3M6.35 3.85 8 2.2l1.65 1.65" />
      <path d="M8 13.8v-3.3M6.35 12.15 8 13.8l1.65-1.65" />
      <path d="M2.2 8h3.3M3.85 6.35 2.2 8l1.65 1.65" />
      <path d="M13.8 8h-3.3M12.15 6.35 13.8 8l-1.65 1.65" />
    </>
  ),
  history: (
    <>
      <path d="M3.2 8a4.8 4.8 0 1 0 1.35-3.4" />
      <path d="M3.15 3.15v2.6h2.6" />
      <path d="M8 5.4V8l1.8 1.25" />
    </>
  ),
  lock: (
    <>
      <rect x="3.5" y="7.2" width="9" height="6.3" rx="1.2" />
      <path d="M5.45 7.2V5.35a2.55 2.55 0 0 1 5.1 0V7.2" />
    </>
  ),
  bookmark: <path d="M4.15 2.6h7.7v10.8L8 10.55 4.15 13.4z" />,
  star: <path d="m8 2.45 1.5 3.2 3.5.42-2.6 2.4.72 3.48L8 10.25l-3.12 1.7.72-3.48-2.6-2.4 3.5-.42z" />,
  apps: (
    <>
      <rect x="2.4" y="2.4" width="4.5" height="4.5" rx="0.9" />
      <rect x="9.1" y="2.4" width="4.5" height="4.5" rx="0.9" />
      <rect x="2.4" y="9.1" width="4.5" height="4.5" rx="0.9" />
      <rect x="9.1" y="9.1" width="4.5" height="4.5" rx="0.9" />
    </>
  ),
  compass: (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="m6.15 9.85 1.15-3.15 3.55-1.55-1.15 3.15z" />
    </>
  ),
  drilldown: (
    <>
      <path d="M2.6 4.15h10.8M2.6 8h7.2M2.6 11.85h3.8" />
      <path d="m10.15 10.15 2.85 2.85M10.55 13h2.55v-2.55" />
    </>
  ),
  'adjust-circle': (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 2.25v11.5" />
    </>
  ),
};

function renderSpec(spec: string | readonly string[]): ReactNode {
  const parts = typeof spec === 'string' ? [spec] : spec;
  const nodes = parts.map((part, index) => renderPart(part, index));
  return nodes.length === 1 ? nodes[0] : <>{nodes}</>;
}

function renderPart(part: string, key: number): ReactNode {
  if (part.startsWith('o:')) {
    const [cx, cy, r] = part.slice(2).split(',').map(Number);
    return <circle key={key} cx={cx} cy={cy} r={r} />;
  }
  if (part.startsWith('q:')) {
    const [x, y, width, height, rx] = part.slice(2).split(',').map(Number);
    return <rect key={key} x={x} y={y} width={width} height={height} rx={rx} />;
  }
  if (part.startsWith('e:')) {
    const [cx, cy, rx, ry] = part.slice(2).split(',').map(Number);
    return <ellipse key={key} cx={cx} cy={cy} rx={rx} ry={ry} />;
  }
  if (part.startsWith('d5:')) {
    return <path key={key} strokeWidth="5" d={part.slice(3)} />;
  }
  if (part.startsWith('d:') || part.startsWith('d2:')) {
    const d = part.startsWith('d2:') ? part.slice(3) : part.slice(2);
    return <path key={key} strokeWidth="2.25" d={d} />;
  }
  return <path key={key} d={part} />;
}

function catalogGlyphs(): Partial<Record<IconName, ReactNode>> {
  const icons: Partial<Record<IconName, ReactNode>> = {};
  for (const [name, spec] of Object.entries(fluentIconCatalog)) {
    if (isIconName(name)) {
      icons[name] = renderSpec(spec);
    }
  }
  return icons;
}

const fluentChromeIcons: Partial<Record<IconName, ReactNode>> = {
  ...catalogGlyphs(),
  ...handTunedIcons,
};

export const fluentChromeIconNames = Object.keys(fluentChromeIcons).filter(isChromeIconName);

function isChromeIconName(name: string): name is IconName {
  return Object.prototype.hasOwnProperty.call(fluentChromeIcons, name);
}

export function getFluentChromeIcon(name: IconName): ReactNode | undefined {
  return fluentChromeIcons[name];
}
