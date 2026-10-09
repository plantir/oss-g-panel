import { render, screen } from '@testing-library/react';

import { availableIconsIndex, getThemeById, ThemeContext } from '@grafana/data';

import { Icon } from './Icon';
import { fluentChromeIconNames } from './fluentChrome';
import { fluentBrandIconNames } from './fluentIconCatalog';

/**
 * These tests are a bit weird because they use an entirely mocked out react-inlinesvg, so these are very superficial
 * tests that should still not give us much confidence. They're primarily intended to catch simple logic bugs in the
 * rendering logic of the Icon component.
 */
describe('Icon', () => {
  it('should render an icon', () => {
    render(<Icon name="heart" />);

    const svg = screen.getByTestId('icon-heart');
    expect(svg).toHaveAttribute('id', expect.stringContaining('heart.svg'));
  });

  it('should render with correct size', () => {
    render(<Icon name="heart" size="lg" />);

    const svg = screen.getByTestId('icon-heart');
    expect(svg).toHaveAttribute('width', '18');
    expect(svg).toHaveAttribute('height', '18');
  });

  it('should set aria-hidden when no accessibility props provided', () => {
    render(<Icon name="heart" />);

    const svg = screen.getByTestId('icon-heart');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not set aria-hidden when title is provided', () => {
    render(<Icon name="heart" title="Heart icon" />);

    const svg = screen.getByTestId('icon-heart');
    expect(svg).toHaveAttribute('aria-hidden', 'false');
    expect(svg).toHaveAttribute('title', 'Heart icon');
  });

  it('should spin the spinner', () => {
    // Not a great test - because the class name is generated we can't know if it's actually applied the spin class
    // so we just check that the class name changes when its the spinner
    render(<Icon name="heart" />);
    const baseClassName = screen.getByTestId('icon-heart').getAttribute('class') || '';

    render(<Icon name="spinner" />);

    const svg = screen.getByTestId('icon-spinner');
    const newClassName = svg.getAttribute('class') || '';
    expect(newClassName).not.toBe(baseClassName);
  });

  // A *very* rudimentary test that the workaround somewhat works. We're not using the real react-inlinesvg,
  // so this just tests the basics of the workaround logic
  it('should update icon when name prop changes', () => {
    const { rerender } = render(<Icon name="heart" />);

    let svg = screen.getByTestId('icon-heart');
    expect(svg).toHaveAttribute('id', expect.stringContaining('heart.svg'));

    rerender(<Icon name="star" />);

    svg = screen.getByTestId('icon-star');
    expect(svg).toHaveAttribute('id', expect.stringContaining('star.svg'));
  });

  it('includes the toolbar chrome glyphs', () => {
    expect(fluentChromeIconNames).toEqual(
      expect.arrayContaining([
        'plus',
        'bars',
        'ellipsis-v',
        'info-circle',
        'question-circle',
        'cog',
        'sync',
        'save',
        'copy',
        'trash-alt',
        'filter',
        'user',
        'bell',
        'home',
        'clock-nine',
        'pen',
        'eye',
        'link',
        'download-alt',
        'upload',
        'play',
        'folder',
        'database',
        'expand-arrows',
        'bookmark',
        'star',
        'apps',
        'compass',
        'drilldown',
        'adjust-circle',
      ])
    );
  });

  it.each(fluentChromeIconNames)('draws a fluent stroke glyph for %s', (name) => {
    render(
      <ThemeContext.Provider value={getThemeById('fluent_light')}>
        <Icon name={name} />
      </ThemeContext.Provider>
    );

    const svg = screen.getByTestId(`icon-${name}`);
    expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    expect(svg).toHaveAttribute('stroke-width', '1.25');
    expect(svg.querySelector('path, circle, rect, ellipse')).toBeInTheDocument();
  });

  it('covers every UI icon and leaves brand marks on the original files', () => {
    const brands = new Set<string>(fluentBrandIconNames);
    const names = Object.keys(availableIconsIndex);
    const missing = names.filter(
      (name) => name !== 'fa fa-spinner' && !brands.has(name) && !fluentChromeIconNames.includes(name)
    );
    const branded = names.filter((name) => brands.has(name) && fluentChromeIconNames.includes(name));

    expect(missing).toEqual([]);
    expect(branded).toEqual([]);
  });

  it('keeps the unicon file for chrome names on stock themes', () => {
    render(
      <ThemeContext.Provider value={getThemeById('light')}>
        <Icon name="search" />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('icon-search')).toHaveAttribute('id', expect.stringContaining('search.svg'));
  });

  it('keeps the original file for brand marks', () => {
    render(
      <ThemeContext.Provider value={getThemeById('fluent_dark')}>
        <Icon name="github" />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('icon-github')).toHaveAttribute('id', expect.stringContaining('github.svg'));
  });
});
