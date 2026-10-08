import { render, screen } from '@testing-library/react';

import { getThemeById, ThemeContext } from '@grafana/data';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('draws a fluent arc instead of the icon font glyph', () => {
    render(
      <ThemeContext.Provider value={getThemeById('fluent_light')}>
        <Spinner />
      </ThemeContext.Provider>
    );

    const arc = screen.getByRole('progressbar');
    expect(arc.querySelector('circle')).toHaveAttribute('stroke', 'currentColor');
    expect(arc.querySelector('circle')).toHaveAttribute('stroke-linecap', 'round');
  });

  it('keeps the icon glyph on stock themes', () => {
    render(
      <ThemeContext.Provider value={getThemeById('light')}>
        <Spinner />
      </ThemeContext.Provider>
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByTestId('Spinner')).toBeInTheDocument();
  });
});
