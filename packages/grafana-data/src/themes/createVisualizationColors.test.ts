import { createColors } from './createColors';
import { createVisualizationColors } from './createVisualizationColors';
import { getThemeById } from './registry';

describe('createVizColors', () => {
  const darkThemeColors = createColors({});
  const vizColors = createVisualizationColors(darkThemeColors);

  it('Can map named colors to real color', () => {
    expect(vizColors.getColorByName('green')).toBe('#73BF69');
  });

  it('Can map named colors using old aliases to real color', () => {
    expect(vizColors.getColorByName('dark-green')).toBe('#37872D');
  });

  it('Can get color from palette', () => {
    expect(vizColors.palette[0]).not.toBeUndefined();
  });

  it('returns color if specified as hex or rgb/a', () => {
    expect(vizColors.getColorByName('#ff0000')).toBe('#ff0000');
    expect(vizColors.getColorByName('#ff0000')).toBe('#ff0000');
    expect(vizColors.getColorByName('#FF0000')).toBe('#FF0000');
    expect(vizColors.getColorByName('#CCC')).toBe('#CCC');
    expect(vizColors.getColorByName('rgb(0,0,0)')).toBe('rgb(0,0,0)');
    expect(vizColors.getColorByName('rgba(0,0,0,1)')).toBe('rgba(0,0,0,1)');
  });

  it('returns hex for named color that is not a part of named colors palette', () => {
    expect(vizColors.getColorByName('lime')).toBe('#00ff00');
  });

  it.each(['fluent_light', 'fluent_dark'])('applies Fluent hue overrides for %s', (themeId) => {
    const theme = getThemeById(themeId);

    expect(theme.visualization.getColorByName('green')).toBe('#13a10e');
    expect(theme.visualization.getColorByName('yellow')).toBe('#c19c00');
    expect(theme.visualization.getColorByName('blue')).toBe('#0f6cbd');
    expect(theme.visualization.getColorByName('orange')).toBe('#ca5010');
    expect(theme.visualization.getColorByName('red')).toBe('#d13438');
    expect(theme.visualization.getColorByName('purple')).toBe('#8764b8');
  });

  it('leaves stock theme hues unchanged when no overrides are provided', () => {
    const stock = createVisualizationColors(createColors({ mode: 'dark' }));
    expect(stock.getColorByName('green')).toBe('#73BF69');
    expect(stock.getColorByName('blue')).toBe('#5794F2');
  });
});
