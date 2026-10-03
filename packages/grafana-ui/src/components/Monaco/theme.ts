import tinycolor from 'tinycolor2';

import { type GrafanaTheme2 } from '@grafana/data';

import { type Monaco, type monacoTypes } from './types';

function getColors(theme?: GrafanaTheme2): monacoTypes.editor.IColors {
  if (theme === undefined) {
    return {};
  } else {
    const colors: Record<string, string> = {
      'editor.background': theme.components.input.background,
      'editor.foreground': theme.colors.text.primary,
      'editorLineNumber.foreground': theme.colors.text.disabled,
      'editorCursor.foreground': theme.colors.primary.main,
      'editor.selectionBackground': theme.colors.action.selected,
      'minimap.background': theme.colors.background.secondary,
    };

    Object.keys(colors).forEach((resultKey) => {
      colors[resultKey] = normalizeColorForMonaco(colors[resultKey]);
    });
    return colors;
  }
}

function getSyntaxRules(theme?: GrafanaTheme2): monacoTypes.editor.ITokenThemeRule[] {
  const syntax = theme?.components.codeEditor;
  return [
    { token: 'comment', foreground: normalizeColorForMonaco(syntax?.comment) },
    { token: 'string', foreground: normalizeColorForMonaco(syntax?.string) },
    { token: 'keyword', foreground: normalizeColorForMonaco(syntax?.keyword) },
    { token: 'number', foreground: normalizeColorForMonaco(syntax?.number) },
    { token: 'regexp', foreground: normalizeColorForMonaco(syntax?.regexp) },
    { token: 'type', foreground: normalizeColorForMonaco(syntax?.type) },
    { token: 'function', foreground: normalizeColorForMonaco(syntax?.function) },
    { token: 'variable', foreground: normalizeColorForMonaco(syntax?.variable) },
    {
      token: 'predefined',
      foreground: normalizeColorForMonaco(syntax?.function ?? theme?.visualization.getColorByName('purple')),
    },
    {
      token: 'operator',
      foreground: normalizeColorForMonaco(syntax?.operator ?? theme?.visualization.getColorByName('orange')),
    },
    {
      token: 'tag',
      foreground: normalizeColorForMonaco(syntax?.string ?? theme?.visualization.getColorByName('green')),
    },
  ];
}

function normalizeColorForMonaco(color?: string): string {
  // monaco needs 6char hex colors
  // see https://github.com/grafana/grafana/issues/43158
  return tinycolor(color).toHexString();
}

// we support calling this without a theme, it will make sure the themes
// are registered in monaco, even if the colors are not perfect.
export default function defineThemes(monaco: Monaco, theme?: GrafanaTheme2) {
  // color tokens are defined here https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts#L174
  const colors = getColors(theme);
  monaco.editor.defineTheme('grafana-dark', {
    base: 'vs-dark',
    inherit: true,
    colors: colors,
    rules: getSyntaxRules(theme),
  });

  monaco.editor.defineTheme('grafana-light', {
    base: 'vs',
    inherit: true,
    colors: colors,
    rules: getSyntaxRules(theme),
  });
}
