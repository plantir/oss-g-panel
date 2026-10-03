import { Branding } from './Branding';

describe('Branding', () => {
  it('uses Monitor Panel titles and hides the edition', () => {
    expect(Branding.AppTitle).toBe('Monitor Panel');
    expect(Branding.LoginTitle).toBe('Welcome to Monitor Panel');
    expect(Branding.HideEdition).toBe(true);
  });
});
