import React, { memo, ReactNode } from 'react';
import styled from 'styled-components';
import { device } from '../theme/stockTheme';

const TopBar = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;

  margin-bottom: 2rem;
  @media ${device.tablet} {
    height: 4rem;
    margin-bottom: 2.5rem;
    flex-direction: row;
  }
`;
const MainLabel = styled.div`
  color: #E50914;
  font-weight: 500;
  font-size: 24px;
  padding-bottom: 10px;

  @media ${device.tablet} {
    padding-bottom: 0;
  }
`;

const HeaderSlot = styled.div`
  flex: 1;
`;

const MiddleSlot = styled(HeaderSlot)`
  display: flex;
  justify-content: center;
`

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
