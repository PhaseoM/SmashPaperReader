import React, { useState, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';
import Markdown from 'react-markdown'

import useWindowSize from '../../utils/useWindowSize';
import { Accordion, AccordionControlProps, ActionIcon, Anchor, Box, createStyles, Divider, Menu, Paper, rem, Skeleton, Text } from '@mantine/core';
import {
    IconArrowsLeftRight,
    IconDots,
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconSettings,
    IconTrash,
    IconBulb,
    IconQuestionMark
} from '@tabler/icons-react';

type winProps = {
    w: number,
    isloading: boolean
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
                <Accordion.Panel><Markdown>{`Scientific publications are crucial for knowledge transfer but face challenges due to their information density and the static PDF format, which lacks interactivity, accessibility for low-vision readers, and mobile-friendliness. While internet technology has transformed paper discovery (e.g., via search engines), the reading process itself has remained largely unchanged for decades. Recent advances in AI (e.g., large language models) and HCI offer opportunities to develop intelligent, interactive reading interfaces even for legacy PDFs, addressing these long-standing issues.`}</Markdown></Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="challenge">
                <AccordionControl>Challenges</AccordionControl>
                <Accordion.Panel><Markdown>{`1. Discovery: Managing and prioritizing vast citations during literature reviews.
2. Efficiency: Skimming and retaining details efficiently amid exponentially growing publications.
3. Comprehension: Understanding dense text, novel terms, and domain-specific knowledge.
4. Synthesis: Connecting insights across multiple papers to identify research gaps.
5. Accessibility: Static PDFs’ incompatibility with screen readers, mobile devices, and low-vision needs.`}</Markdown></Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="research-methods">
                <AccordionControl>Methodology</AccordionControl>
                <Accordion.Panel><Markdown>{`1. Prototypes (10 total, targeting 5 challenges):
    * Discovery: CiteSee (personalized citation highlights); CiteRead (future work margin notes).
    * Efficiency: Scim (AI highlights); Ocean (low-vision navigation aids).
    * Synthesis: Threddy (thread-based clipping); Relatedly (cross-paper exploration).
    * Accessibility: SciA11y (PDF→HTML conversion).
2. Usability Studies: 300+ participants tested prototype effectiveness.
3. Product: Semantic Reader tool (free, interactive, with features like citation pop-ups).`}</Markdown></Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="research-conclusion">
                <AccordionControl>Research Conclusion</AccordionControl>
                <Accordion.Panel><Markdown>{`The project leverages AI/HCI to transform static PDFs into dynamic, accessible interfaces, addressing key reading challenges. Prototypes and the Semantic Reader tool improve discovery, efficiency, comprehension, synthesis, and accessibility, with user studies validating benefits. Open science resources foster further innovation, though challenges like AI accuracy and ethics remain. The initiative pioneers a more interactive and inclusive future for academic reading.`}</Markdown></Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
const KnowledgeBase: React.FC<winProps> = ({ w, isloading }: winProps) => {
    return (
        <div>
            <Text fz="xl" fw={700} pb={20}>Knowledge Base</Text>
            <div style={{
                width: w * 0.8,
                padding: "10px 0px 10px 0px"
            }}>
                <Skeleton visible={isloading}>
                    <Paper p={10} withBorder radius="md">
                        <div className='knowbase_keyword'>
                            <IconBulb />
                            <Text fz="md" fw={500}>PaperReader</Text>
                        </div>
                        <div className='knowbase_anchor'>
                            <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                                <Text truncate>
                                    Qlarify: Recursively Expandable Abstracts for Directed Information Retrieval over Scientific Papers
                                </Text>
                            </Anchor>
                            <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                                <Text truncate>
                                    Paper Plain: Making Medical Research Papers Approachable to Healthcare Consumers with Natural Language Processing
                                </Text>
                            </Anchor>
                        </div>
                    </Paper>
                </Skeleton>
            </div>
            <div style={{
                width: w * 0.8,
                padding: "10px 0px 10px 0px"
            }}>
                <Skeleton visible={isloading}>
                    <Paper p={10} withBorder radius="md">
                        <div className='knowbase_keyword'>
                            <IconQuestionMark />
                            <Text fz="md" fw={500}>How does the system parse academic papers?</Text>
                        </div>
                        <div className='knowbase_anchor'>
                            <Anchor href="https://arxiv.org/pdf/2303.14334" target="_blank">
                                <Text truncate>
                                    Hammer PDF: An Intelligent PDF Reader for Scientific Papers
                                </Text>
                            </Anchor>
                        </div>
                    </Paper>
                </Skeleton>
            </div>
        </div>
    );
}


export const Digest: React.FC<winProps> = ({ w }: winProps) => {
    const [loading, setLoading] = useState(false)
    return (
        <div className='digest_style'
            style={{
                height: window.innerHeight
            }}>
            <Text fz="xl" fw={700} pt={10} pb={20}>AI Conclusion</Text>
            <Skeleton visible={loading}>
                <AccordionList />
            </Skeleton>
            <div style={{
                padding: "30px 0px 30px 0px",
                width: "90%"
            }}>
                <Divider my="sm" />
            </div>
            <KnowledgeBase w={w} isloading={loading} />
        </div>
    );
}