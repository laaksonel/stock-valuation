import React, { memo, ReactNode } from 'react';
import { TopBar, HeaderSlot, MainLabel, MiddleSlot } from './layout.styles';

interface IHeader {
  label: string;
  children: ReactNode;
}

const Header = ({ label, children }: IHeader) => (
  <TopBar>
    <HeaderSlot>
      <MainLabel>{ label }</MainLabel>
    </HeaderSlot>
    <MiddleSlot>
      { children }
    </MiddleSlot>
    <HeaderSlot>
      {/* Empty for now */}
    </HeaderSlot>
  </TopBar>
);

export default memo(Header);
