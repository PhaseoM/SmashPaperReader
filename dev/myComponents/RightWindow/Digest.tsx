import React, { useState, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';

import useWindowSize from '../../utils/useWindowSize';
import { Accordion, AccordionControlProps, ActionIcon, Anchor, Box, createStyles, Divider, Menu, Paper, rem, Text } from '@mantine/core';
import { IconArrowsLeftRight, IconDots, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash, IconBulb } from '@tabler/icons-react';

type winProps = {
    w: number,
}

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.sm,
    },

    item: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        border: `${rem(1)} solid transparent`,
        position: 'relative',
        zIndex: 0,
        transition: 'transform 150ms ease',

        '&[data-active]': {
            transform: 'scale(1.03)',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            boxShadow: theme.shadows.md,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
            borderRadius: theme.radius.md,
            zIndex: 1,
        },
    },

    chevron: {
        '&[data-rotate]': {
            transform: 'rotate(-90deg)',
        },
    },
}));


const AccordionControl: React.FC<AccordionControlProps> = (props: AccordionControlProps) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Accordion.Control {...props} />
            <Menu shadow="md" width={50}>
                <Menu.Target>
                    <ActionIcon size="lg">
                        <IconDots size="1rem" />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* <Menu.Label>Application</Menu.Label> */}
                    {/* <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                    <Menu.Item icon={<IconSearch size={14} />}>Query</Menu.Item> */}
                    <Menu.Item icon={<IconMessageCircle size={14} />} />
                    <Menu.Item icon={<IconSearch size={14} />} />
                </Menu.Dropdown>
            </Menu>
        </Box>
    );
}

const AccordionList: React.FC = () => {
    const { classes } = useStyles();
    return (
        <Accordion chevronPosition="left" defaultValue="background"
            // classNames={classes}
            // className={classes.root}
            w={400}
            style={{
                background: "white",
            }}
        >
            <Accordion.Item value="background">
                <AccordionControl>Background</AccordionControl>
                <Accordion.Panel>background</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="challenge">
                <AccordionControl>Challenge</AccordionControl>
                <Accordion.Panel>challenge</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="research-methods">
                <AccordionControl>Research Methods</AccordionControl>
                <Accordion.Panel>research-methods</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="research-conclusion">
                <AccordionControl>Research Conclusion</AccordionControl>
                <Accordion.Panel>research-conclusion</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
const KnowledgeBase: React.FC<winProps> = ({ w }: winProps) => {
    return (
        <div>
            <Text fz="xl" fw={700} pb={20}>Knowledge Base</Text>
            <div style={{
                width: w * 0.8,
                padding: "10px 0px 10px 0px"
            }}>
                <Paper p={10} withBorder radius="md">
                    <div className='knowbase_keyword'>
                        <IconBulb />
                        <Text fz="md" fw={500}>.......KeyWord_1...</Text>
                    </div>
                    <div className='knowbase_anchor'>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_1...
                        </Anchor>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_2...
                        </Anchor>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_3...
                        </Anchor>
                    </div>
                </Paper>
            </div>
            <div style={{
                width: w * 0.8,
                padding: "10px 0px 10px 0px"
            }}>
                <Paper p={10} withBorder radius="md">
                    <div className='knowbase_keyword'>
                        <IconBulb />
                        <Text fz="md" fw={500}>.......KeyWord_2...</Text>
                    </div>
                    <div className='knowbase_anchor'>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_1...
                        </Anchor>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_2...
                        </Anchor>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_3...
                        </Anchor>
                    </div>
                </Paper>
            </div>
            <div style={{
                width: w * 0.8,
                padding: "10px 0px 10px 0px"
            }}>
                <Paper p={10} withBorder radius="md">
                    <div className='knowbase_keyword'>
                        <IconBulb />
                        <Text fz="md" fw={500}>.......KeyWord_3...</Text>
                    </div>
                    <div className='knowbase_anchor'>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_1...
                        </Anchor>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_2...
                        </Anchor>
                        <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                            paper_3...
                        </Anchor>
                    </div>
                </Paper>
            </div>
        </div>
    );
}


export const Digest: React.FC<winProps> = ({ w }: winProps) => {
    return (
        <div className='digest_style'
            style={{
                height: window.innerHeight
            }}>
            <Text fz="xl" fw={700} pt={10} pb={20}>AI Conclusion</Text>
            <AccordionList />
            <div style={{
                padding: "30px 0px 30px 0px",
                width: "90%"
            }}>
                <Divider my="sm" />
            </div>
            <KnowledgeBase w={w} />
        </div>
    );
}