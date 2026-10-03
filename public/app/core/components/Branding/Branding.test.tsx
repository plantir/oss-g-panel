import { createTheme, getThemeById } from '@grafana/data';

import { Branding } from './Branding';

describe('Branding', () => {
  it('uses Monitor Panel titles and hides the edition', () => {
    expect(Branding.AppTitle).toBe('Monitor Panel');
    expect(Branding.LoginTitle).toBe('Welcome to Monitor Panel');
    expect(Branding.HideEdition).toBe(true);
  });

  it('replaces Grafana-managed identity only on Fluent themes', () => {
    const fluent = getThemeById('fluent_light');
    const stock = createTheme();

    expect(Branding.getManagedRulesLabel(fluent)).toBe('Panel-managed');
    expect(Branding.getManagedRulesFilterLabel(fluent)).toBe('Panel managed');
    expect(Branding.hideEmptyStateMascot(fluent)).toBe(true);

    expect(Branding.getManagedRulesLabel(stock)).toBe('Grafana-managed');
    expect(Branding.getManagedRulesFilterLabel(stock)).toBe('Grafana managed');
    expect(Branding.hideEmptyStateMascot(stock)).toBe(false);
  });
});
