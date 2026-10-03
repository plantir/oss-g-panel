import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';

export const MENU_WIDTH = '320px';
export const FLUENT_MENU_WIDTH = '300px';

/** Docked mega menu is 300px in Fluent frames; stock themes keep 320px. */
export function getMegaMenuWidth(theme: GrafanaTheme2): string {
  return hasSolidBrandGradient(theme) ? FLUENT_MENU_WIDTH : MENU_WIDTH;
}
