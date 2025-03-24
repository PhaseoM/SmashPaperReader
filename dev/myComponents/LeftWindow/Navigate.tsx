import {
    Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack, rem, AppShell
} from '@mantine/core';
import {
    IconListTree,
    IconCategory,
    IconBalloon,
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconCalendarStats,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import React from 'react';
import { Reader } from '../../components/Reader';
import { ContextProvider } from '@allenai/pdf-components';
import { RouteComponentProps } from 'react-router-dom';

import { useState, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';

const useStyles = createStyles((theme) => ({
    link: {
        width: rem(50),
        height: rem(50),
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

interface NavbarLinkProps {
    icon: React.FC<any>;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = useStyles();
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon size="1.2rem" stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconListTree, label: 'Outline' },
    { icon: IconCategory, label: 'Thumbnail' },
    { icon: IconBalloon, label: 'PaperCopilot' },
];

export const Navigate: React.FunctionComponent<RouteComponentProps> = (routeprops) => {
    // const [active, setActive] = useState(-1);
    const { itemSelected: active, setItemSelected: setActive } = useContext(NavItemContext);
    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                setActive(active === index ? -1 : index)
            }
            }
        />
    ));

    return (
        <Navbar width={{ base: 80 }} p="md">
            {/* <Center>
                <MantineLogo type="mark" size={30} />
            </Center> */}
            <Navbar.Section grow mt={50}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <NavbarLink icon={IconUser} label="User" />
                    <NavbarLink icon={IconSettings} label="Settings" />
                    <NavbarLink
                        icon={IconLogout}
                        label="BacktoStart"
                        onClick={() => {
                            routeprops.history.push('/start');
                        }} />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}