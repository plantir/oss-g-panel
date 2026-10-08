import { getThemeById } from '@grafana/data';

import { getPropertiesForVariant } from '../components/Button/Button';
import { getFluentFieldFocusStyle } from '../components/Forms/commonStyles';

import { getCalloutChrome, getFocusStyles } from './mixins';

describe('fluent control chrome', () => {
  const light = getThemeById('fluent_light');
  const dark = getThemeById('fluent_dark');
  const stock = getThemeById('light');

  it.each([light, dark])('uses a solid focus stroke for %s', (theme) => {
    const focus = getFocusStyles(theme);

    expect(focus.outline).toBe(theme.isDark ? '2px solid #ffffff' : '2px solid #000000');
    expect(focus.outlineOffset).toBe('2px');
    expect(focus.boxShadow).toBe('none');
  });

  it('keeps the stock focus ring on non-fluent themes', () => {
    expect(getFocusStyles(stock).boxShadow).toContain(stock.colors.accent.main);
  });

  it('draws a brand underline on focused fields', () => {
    expect(getFluentFieldFocusStyle(light).borderBottomColor).toBe('#0f6cbd');
    expect(getFluentFieldFocusStyle(light).boxShadow).toBe('inset 0 -1px 0 0 #0f6cbd');
    expect(getFluentFieldFocusStyle(light, true).borderBottomColor).toBe(light.colors.error.border);
  });

  it('styles primary and secondary buttons like Fluent', () => {
    const primary = getPropertiesForVariant(light, 'primary', 'solid');
    const secondary = getPropertiesForVariant(light, 'secondary', 'solid');

    expect(primary).toMatchObject({
      background: '#0f6cbd',
      color: '#ffffff',
      border: '1px solid transparent',
    });
    expect(primary['&:hover']).toMatchObject({ boxShadow: 'none', background: '#115ea3' });

    expect(secondary).toMatchObject({
      background: '#ffffff',
      color: '#242424',
      borderBottomColor: '#616161',
    });
    expect(secondary['&:hover']).toMatchObject({ boxShadow: 'none', background: '#f5f5f5' });
  });

  it('uses a short bordered callout on fluent themes', () => {
    expect(getCalloutChrome(light)).toMatchObject({
      borderRadius: '4px',
      boxShadow: light.shadows.z2,
      border: '1px solid #e0e0e0',
    });
    expect(getCalloutChrome(stock)).toEqual({});
  });
});
