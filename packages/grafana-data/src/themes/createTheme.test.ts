import { getContrastRatio } from './colorManipulator';
import { createTheme } from './createTheme';
import { getThemeById } from './registry';

describe('createTheme', () => {
  it('create custom theme', () => {
    const custom = createTheme({
      colors: {
        mode: 'dark',
        primary: {
          main: 'rgb(240,0,0)',
        },
        background: {
          canvas: '#123',
        },
      },
    });

    expect(custom.colors.primary.main).toBe('rgb(240,0,0)');
    expect(custom.colors.primary.shade).toBe('rgb(242, 38, 38)');
    expect(custom.colors.background.canvas).toBe('#123');
  });

  it('create default theme', () => {
    const theme = createTheme();
    expect(theme.colors.mode).toBe('dark');
  });

  it('deep-merges component overrides on top of the defaults', () => {
    const theme = createTheme({
      components: {
        height: { sm: 99 },
      },
    });

    // overridden value is applied
    expect(theme.components.height.sm).toBe(99);
    // sibling defaults are preserved by the deep merge
    expect(theme.components.height.md).toBe(4);
    expect(theme.components.height.lg).toBe(6);
  });

  it('replaces tag colors wholesale rather than merging by index', () => {
    const theme = createTheme({
      components: {
        tag: {
          colors: [{ background: '#fff', text: '#000' }],
        },
      },
    });

    expect(theme.components.tag.colors).toEqual([{ background: '#fff', text: '#000' }]);
  });

  it.each(['visual_refresh_dark', 'visual_refresh_light'])(
    'meets code editor contrast requirements for %s',
    (themeId) => {
      const theme = getThemeById(themeId);

      for (const background of [theme.components.input.background, theme.colors.background.secondary]) {
        for (const color of Object.values(theme.components.codeEditor)) {
          expect(getContrastRatio(color, background)).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  );

  it('applies Fluent Light tokens from the token sheet', () => {
    const theme = getThemeById('fluent_light');

    expect(theme.colors.primary.main).toBe('#0f6cbd');
    expect(theme.colors.primary.text).toBe('#0f6cbd');
    expect(theme.colors.primary.contrastText).toBe('#ffffff');
    expect(theme.colors.primary.shade).toBe('#115ea3');
    expect(theme.colors.background.canvas).toBe('#fafafa');
    expect(theme.colors.background.primary).toBe('#ffffff');
    expect(theme.colors.background.secondary).toBe('#f5f5f5');
    expect(theme.colors.background.elevated).toBe('#ffffff');
    expect(theme.colors.text.link).toBe('#0f6cbd');
    expect(theme.colors.secondary.main).toBe('#f5f5f5');
    expect(theme.colors.secondary.shade).toBe('#ebebeb');
    expect(theme.colors.action.hover).toBe('#f5f5f5');
    expect(theme.colors.action.selected).toBe('#ebebeb');
    expect(theme.colors.action.disabledBackground).toBe('#f0f0f0');
    expect(theme.colors.gradients.brandHorizontal).toBe('#0f6cbd');
    expect(theme.colors.gradients.brandVertical).toBe('#0f6cbd');
    expect(theme.components.input.background).toBe('#ffffff');
    expect(theme.components.input.borderColor).toBe('#d1d1d1');
    expect(theme.components.panel.background).toBe('#ffffff');
    expect(theme.components.panel.borderColor).toBe('#e0e0e0');
    expect(theme.components.panel.headerHeight).toBe(4);
    expect(theme.components.switch.activeBackground).toBe('#0f6cbd');
    expect(theme.shape.radius.default).toBe('4px');
    expect(theme.shape.radius.sm).toBe('2px');
    expect(theme.shape.radius.lg).toBe('8px');
    expect(theme.typography.fontFamily).toContain('Segoe UI');
    expect(theme.typography.fontFamilyMonospace).toContain('Consolas');
    expect(theme.shadows.z3).toContain('32px 64px');
  });

  it('applies Fluent Dark tokens from the token sheet', () => {
    const theme = getThemeById('fluent_dark');

    expect(theme.colors.primary.main).toBe('#479ef5');
    expect(theme.colors.primary.text).toBe('#479ef5');
    expect(theme.colors.primary.contrastText).toBe('#000000');
    expect(theme.colors.background.canvas).toBe('#141414');
    expect(theme.colors.background.primary).toBe('#1f1f1f');
    expect(theme.colors.background.secondary).toBe('#292929');
    expect(theme.colors.background.elevated).toBe('#292929');
    expect(theme.colors.text.link).toBe('#479ef5');
    expect(theme.colors.secondary.main).toBe('#292929');
    expect(theme.colors.secondary.shade).toBe('#333333');
    expect(theme.colors.action.hover).toBe('#383838');
    expect(theme.colors.action.selected).toBe('#333333');
    expect(theme.colors.action.disabledBackground).toBe('#141414');
    expect(theme.colors.gradients.brandHorizontal).toBe('#479ef5');
    expect(theme.components.input.background).toBe('#292929');
    expect(theme.components.input.borderColor).toBe('#666666');
    expect(theme.components.panel.background).toBe('#1f1f1f');
    expect(theme.components.panel.borderColor).toBe('#333333');
    expect(theme.shape.radius.default).toBe('4px');
    expect(theme.typography.fontFamilyMonospace).toContain('Consolas');
  });
});
