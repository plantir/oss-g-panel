import { type ComponentProps } from 'react';

import { hasSolidBrandGradient } from '@grafana/data';
import { Box, useTheme2 } from '@grafana/ui';

type Props = Omit<ComponentProps<typeof Box>, 'backgroundColor' | 'borderRadius' | 'padding'>;

/** Canvas-colored card container used for homepage sections. */
export function HomeSection(props: Props) {
  const theme = useTheme2();
  const fluent = hasSolidBrandGradient(theme);

  return (
    <Box
      backgroundColor={fluent ? 'secondary' : 'canvas'}
      borderRadius="default"
      padding={2.5}
      borderStyle={fluent ? 'solid' : undefined}
      borderColor={fluent ? 'weak' : undefined}
      {...props}
    />
  );
}
