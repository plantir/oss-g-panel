import { getThemeById } from '@grafana/data';

import { getMegaMenuWidth } from '../MegaMenu/megaMenuWidth';

import { getChromeActionsBarHeight, getChromeTopBarHeight, getChromeTotalHeaderHeight } from './useChromeHeaderHeight';

describe('fluent chrome measurements', () => {
  const fluentLight = getThemeById('fluent_light');
  const fluentDark = getThemeById('fluent_dark');
  const stockDark = getThemeById('dark');
  const stockLight = getThemeById('light');

  it.each([fluentLight, fluentDark])('uses a 300px mega menu and 40/48 header split for %s', (theme) => {
    expect(getMegaMenuWidth(theme)).toBe('300px');
    expect(getChromeTopBarHeight(theme)).toBe(40);
    expect(getChromeActionsBarHeight(theme)).toBe(48);
    expect(getChromeTotalHeaderHeight(1, theme)).toBe(40);
    expect(getChromeTotalHeaderHeight(2, theme)).toBe(88);
  });

  it.each([stockDark, stockLight])('keeps the stock mega menu width for %s', (theme) => {
    expect(getMegaMenuWidth(theme)).toBe('320px');
    expect(getChromeTopBarHeight(theme)).toBe(getChromeActionsBarHeight(theme));
  });
});
