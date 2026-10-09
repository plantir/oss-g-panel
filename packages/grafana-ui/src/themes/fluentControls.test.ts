import { getThemeById } from '@grafana/data';

import { getPropertiesForVariant } from '../components/Button/Button';
import { getFluentSwatchSelection } from '../components/ColorPicker/ColorSwatch';
import { getFluentSpectrumChrome } from '../components/ColorPicker/SpectrumPalette';
import { getFilterPillChrome } from '../components/FilterPill/FilterPill';
import { getFluentFieldFocusStyle } from '../components/Forms/commonStyles';
import { getFluentSpinnerArc } from '../components/Spinner/Spinner';
import { getFluentTeachingBubbleChrome } from '../components/Toggletip/Toggletip';
import { getFluentOverflowLayout } from '../components/ToolbarButton/ToolbarButtonRow';

import { getQueryEditorStyles } from './GlobalStyles/queryEditor';
import { getSlateStyles } from './GlobalStyles/slate';
import { getUtilityClassStyles } from './GlobalStyles/utilityClasses';
import {
  getCalloutChrome,
  getFluentActiveChrome,
  getFluentDetailsListChrome,
  getFluentGroupHeaderChrome,
  getFluentListItemChrome,
  getFluentShimmerColors,
  getFluentTooltipChrome,
  getFocusStyles,
} from './mixins';

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

  it('draws a short brand arc for the spinner', () => {
    const arc = getFluentSpinnerArc(16);

    expect(arc.stroke).toBe(1.5);
    expect(arc.radius).toBe(7.25);
    expect(getFluentSpinnerArc(24).stroke).toBe(2);
    expect(getFluentSpinnerArc(36).stroke).toBe(3);
    expect(arc.dasharray.split(' ').map(Number)[0]).toBeLessThan(2 * Math.PI * arc.radius);
  });

  it.each([
    ['fluent light', light, { baseColor: '#ebebeb', highlightColor: '#f5f5f5' }],
    ['fluent dark', dark, { baseColor: '#292929', highlightColor: '#383838' }],
  ] as const)('uses a neutral shimmer on %s', (_name, theme, colors) => {
    expect(getFluentShimmerColors(theme)).toEqual(colors);
  });

  it('leaves shimmer colors to the stock theme', () => {
    expect(getFluentShimmerColors(stock)).toBeUndefined();
  });

  it('gives a plain list row a neutral hover wash', () => {
    expect(getFluentListItemChrome(light)).toEqual({
      borderRadius: '4px',
      hoverBackground: '#f5f5f5',
    });
    expect(getFluentListItemChrome(dark)?.hoverBackground).toBe('#383838');
    expect(getFluentListItemChrome(stock)).toBeUndefined();
  });

  it('draws filter pills as neutral chips', () => {
    expect(getFilterPillChrome(light, false)).toMatchObject({
      borderRadius: '4px',
      borderColor: '#d1d1d1',
      background: '#f5f5f5',
      fontWeight: 400,
    });
    expect(getFilterPillChrome(light, true)).toMatchObject({
      background: '#ebebeb',
      borderColor: '#616161',
    });
    expect(getFilterPillChrome(stock, true)).toBeUndefined();
  });

  it('draws a teaching bubble as an elevated card', () => {
    expect(getFluentTeachingBubbleChrome(light)).toMatchObject({
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      titleColor: '#242424',
      titleFontWeight: 600,
      footerBorder: '1px solid #e0e0e0',
    });
    expect(getFluentTeachingBubbleChrome(dark)?.background).toBe('#292929');
    expect(getFluentTeachingBubbleChrome(stock)).toBeUndefined();
  });

  it('stacks overflow commands in a callout', () => {
    expect(getFluentOverflowLayout(light)).toMatchObject({
      borderRadius: '4px',
      border: '1px solid #e0e0e0',
      backgroundColor: '#ffffff',
      flexDirection: 'column',
      flexWrap: 'nowrap',
    });
    expect(getFluentOverflowLayout(stock)).toBeUndefined();
  });

  it('selects a swatch with a brand ring', () => {
    expect(getFluentSwatchSelection(light, true)).toBe('0 0 0 2px #ffffff, 0 0 0 4px #0f6cbd');
    expect(getFluentSwatchSelection(dark, true)).toBe('0 0 0 2px #292929, 0 0 0 4px #479ef5');
    expect(getFluentSwatchSelection(light, false)).toBeUndefined();
    expect(getFluentSwatchSelection(stock, true)).toBeUndefined();
  });

  it('splits the color spectrum into a panel and thin sliders', () => {
    expect(getFluentSpectrumChrome(light)).toEqual({
      gap: '8px',
      radius: '4px',
      sliderHeight: '8px',
      thumbSize: '16px',
      thumbBorder: '2px solid #ffffff',
    });
    expect(getFluentSpectrumChrome(dark)?.thumbBorder).toBe('2px solid #ffffff');
    expect(getFluentSpectrumChrome(stock)).toBeUndefined();
  });

  it('draws a tooltip as a small callout', () => {
    expect(getFluentTooltipChrome(light)).toEqual({
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      boxShadow: light.shadows.z2,
      color: '#242424',
    });
    expect(getFluentTooltipChrome(dark)?.background).toBe('#292929');
    expect(getFluentTooltipChrome(stock)).toBeUndefined();
  });

  it('marks an active command with a neutral wash', () => {
    expect(getFluentActiveChrome(light)).toEqual({
      background: '#ebebeb',
      color: '#242424',
      boxShadow: 'none',
    });
    expect(getFluentActiveChrome(dark)?.background).toBe('#333333');
    expect(getFluentActiveChrome(stock)).toBeUndefined();
  });

  it('styles a plain data grid like a details list', () => {
    expect(getFluentDetailsListChrome(light)).toMatchObject({
      headerBackground: '#f5f5f5',
      headerColor: '#424242',
      headerWeight: 600,
      headerBorder: '1px solid #d1d1d1',
      rowHover: '#f5f5f5',
    });
    expect(getFluentDetailsListChrome(stock)).toBeUndefined();
  });

  it('styles a grouped list header as a ruled semibold row', () => {
    expect(getFluentGroupHeaderChrome(light)).toMatchObject({
      borderBottom: '1px solid #e0e0e0',
      hoverBackground: '#f5f5f5',
      labelColor: '#242424',
      labelFontWeight: 600,
      radius: '4px',
    });
    expect(getFluentGroupHeaderChrome(dark)).toMatchObject({
      borderBottom: '1px solid #333333',
      hoverBackground: '#383838',
      labelColor: '#ffffff',
    });
    expect(getFluentGroupHeaderChrome(stock)).toBeUndefined();
  });

  it('uses fluent code colors for query operators and highlights', () => {
    const fluentQuery = getQueryEditorStyles(light).styles;
    const stockQuery = getQueryEditorStyles(stock).styles;

    expect(fluentQuery).toContain(`${light.components.codeEditor.operator} !important`);
    expect(fluentQuery).not.toContain(light.v1.palette.orange);
    expect(stockQuery).toContain(`${stock.v1.palette.orange} !important`);

    expect(getUtilityClassStyles(light).styles).toContain(light.colors.primary.text);
    expect(getUtilityClassStyles(stock).styles).toContain(stock.v1.palette.orange);

    const fluentSlate = getSlateStyles(light).styles;
    const stockSlate = getSlateStyles(stock).styles;

    expect(fluentSlate).toContain(light.components.codeEditor.regexp);
    expect(fluentSlate).toContain(light.components.codeEditor.operator);
    expect(fluentSlate).not.toContain('#fe85fc');
    expect(fluentSlate).not.toContain(light.v1.palette.orange);
    expect(stockSlate).toContain('#fe85fc');
    expect(stockSlate).toContain(stock.v1.palette.orange);
  });
});
