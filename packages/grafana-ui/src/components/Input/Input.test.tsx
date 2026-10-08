import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { getThemeById, ThemeContext } from '@grafana/data';

import { Input } from './Input';

function ControlledCount({ initial = '1', max, min }: { initial?: string; max?: number; min?: number }) {
  const [value, setValue] = useState(initial);

  return (
    <Input
      type="number"
      aria-label="Count"
      value={value}
      min={min}
      max={max}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}

describe('Input spin buttons', () => {
  it('steps a fluent number field from the end buttons', async () => {
    const user = userEvent.setup();

    render(
      <ThemeContext.Provider value={getThemeById('fluent_light')}>
        <ControlledCount />
      </ThemeContext.Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(screen.getByRole('spinbutton', { name: 'Count' })).toHaveValue(2);

    await user.click(screen.getByRole('button', { name: 'Decrease value' }));
    expect(screen.getByRole('spinbutton', { name: 'Count' })).toHaveValue(1);
  });

  it('stops at min and max', () => {
    render(
      <ThemeContext.Provider value={getThemeById('fluent_dark')}>
        <ControlledCount initial="3" min={1} max={3} />
      </ThemeContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeEnabled();
  });

  it('keeps browser steppers on stock themes', () => {
    render(
      <ThemeContext.Provider value={getThemeById('light')}>
        <Input type="number" aria-label="Count" />
      </ThemeContext.Provider>
    );

    expect(screen.queryByRole('button', { name: 'Increase value' })).not.toBeInTheDocument();
  });

  it('leaves the end of the field to a custom suffix', () => {
    render(
      <ThemeContext.Provider value={getThemeById('fluent_light')}>
        <Input type="number" aria-label="Count" suffix={<span>km</span>} />
      </ThemeContext.Provider>
    );

    expect(screen.queryByRole('button', { name: 'Increase value' })).not.toBeInTheDocument();
    expect(screen.getByText('km')).toBeInTheDocument();
  });
});
