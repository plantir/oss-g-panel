import { css } from '@emotion/css';

import { hasSolidBrandGradient, type GrafanaTheme2 } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';
import { useFlagGrafanaVisualDesignRefresh } from '@grafana/runtime/internal';
import { Box, IconButton, Stack, useStyles2, useTheme2, Text } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { useHomeNav } from 'app/core/hooks/useHomeNav';

import { HomeLogo, HomeTitle } from '../../Branding/Branding';
import { OrganizationSwitcher } from '../OrganizationSwitcher/OrganizationSwitcher';
import { getChromeTopBarHeight } from '../TopBar/useChromeHeaderHeight';

export interface Props {
  handleDockedMenu: () => void;
  onClose: () => void;
}

export const DOCK_MENU_BUTTON_ID = 'dock-menu-button';
export const MEGA_MENU_HEADER_TOGGLE_ID = 'mega-menu-header-toggle';

export function MegaMenuHeader({ handleDockedMenu, onClose }: Props) {
  const visualRefreshEnabled = useFlagGrafanaVisualDesignRefresh();
  const theme = useTheme2();
  const fluent = hasSolidBrandGradient(theme);
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const homeNav = useHomeNav();
  const styles = useStyles2(getStyles, visualRefreshEnabled, fluent);

  // When undocked we do not show a header, but just the org switcher (which only renders when there are multiple orgs)
  if (!state.megaMenuDocked) {
    return <OrganizationSwitcher undocked={true} />;
  }

  // Fluent docked chrome matches the design: "Menu" + dock/undock + close. Home is a nav row.
  if (fluent) {
    return (
      <div className={styles.header}>
        <Text variant="body" weight="medium">
          <Trans i18nKey="navigation.megamenu.menu-title">Menu</Trans>
        </Text>
        <div className={styles.flexGrow} />
        <IconButton
          id={DOCK_MENU_BUTTON_ID}
          className={styles.dockMenuButton}
          aria-label={
            state.megaMenuDocked
              ? t('navigation.megamenu.undock', 'Undock menu')
              : t('navigation.megamenu.dock', 'Dock menu')
          }
          tooltip={
            state.megaMenuDocked
              ? t('navigation.megamenu.undock', 'Undock menu')
              : t('navigation.megamenu.dock', 'Dock menu')
          }
          name="web-section-alt"
          onClick={handleDockedMenu}
          variant="secondary"
        />
        <IconButton
          aria-label={t('navigation.megamenu.close', 'Close menu')}
          tooltip={t('navigation.megamenu.close', 'Close menu')}
          name="times"
          onClick={onClose}
          size="lg"
          variant="secondary"
        />
      </div>
    );
  }

  return (
    <div className={styles.header}>
      <Stack alignItems="center" minWidth={0} gap={1}>
        {state.megaMenuDocked && <HomeLogo homeNav={homeNav} onClick={state.megaMenuDocked ? undefined : onClose} />}
        <OrganizationSwitcher>
          {state.megaMenuDocked && <HomeTitle homeNav={homeNav} onClick={state.megaMenuDocked ? undefined : onClose} />}
          {!state.megaMenuDocked && (
            <Box paddingLeft={2}>
              <Text color="secondary">
                <Trans i18nKey="navigation.megamenu.header-title">Navigation</Trans>
              </Text>
            </Box>
          )}
        </OrganizationSwitcher>
      </Stack>
      <div className={styles.flexGrow} />
      <IconButton
        aria-label={t('navigation.megamenu.close', 'Close menu')}
        tooltip={t('navigation.megamenu.close', 'Close menu')}
        name="times"
        onClick={onClose}
        size="lg"
        variant="secondary"
      />
    </div>
  );
}

MegaMenuHeader.displayName = 'MegaMenuHeader';

const getStyles = (theme: GrafanaTheme2, visualRefreshEnabled: boolean, fluent = false) => ({
  dockMenuButton: css({
    display: fluent ? 'inline-flex' : 'none',

    [theme.breakpoints.up('xl')]: {
      display: 'inline-flex',
    },
  }),
  header: css({
    alignItems: 'center',
    borderBottom: visualRefreshEnabled ? undefined : `1px solid ${theme.colors.border.weak}`,
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 1),
    height: getChromeTopBarHeight(theme),
    flexShrink: 0,
  }),
  flexGrow: css({ flexGrow: 1 }),
});
