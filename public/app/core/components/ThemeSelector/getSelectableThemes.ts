import { getBuiltInThemes } from '@grafana/data';

export function getSelectableThemes() {
  const allowedExtraThemes = [
    'deut_prot_dark',
    'deut_prot_light',
    'tritanopia_dark',
    'tritanopia_light',
    'desertbloom',
    'gildedgrove',
    'sapphiredusk',
    'tron',
    'gloom',
    'fluent_light',
    'fluent_dark',
  ];

  return getBuiltInThemes(allowedExtraThemes);
}
