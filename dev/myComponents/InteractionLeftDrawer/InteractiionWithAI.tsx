import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { UiContext } from '@allenai/pdf-components';
type Props = {
    parentRef: React.RefObject<HTMLDivElement>;
};


export const InteractionDrawer: React.FunctionComponent<Props> = ({ parentRef }: Props) => {
    const { isShowingInteract, setIsShowingInteract } = React.useContext(UiContext);
    const handleHideInteract = React.useCallback(() => {
        setIsShowingInteract(false);
    }, []);

    return (
        <Drawer
            title="Paper Copilot"
            placement="left"
            visible={isShowingInteract}
            closable={false}
            onClose={handleHideInteract}
            // Passing this ref mounts the drawer "inside" the grid content area
            // instead of using the entire browser height.
            //@ts-ignore there's something wonky with the types here
            getContainer={parentRef.current}
            className="reader__paperc-drawer">
            <div
                className='InetractArea'
            >

            </div>
            <input
                type='text'
                className='usrInput'
                placeholder='Please Enter'
            >

            </input>
        </Drawer>
    );
};