import React, { memo, ReactNode } from 'react';
import styled from 'styled-components';

const TopBar = styled.div`
  height: 4rem;
  background: #FFFFFF;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
`;
const MainLabel = styled.div`
  color: #E50914;
  font-weight: 500;
  font-size: 2rem;
  padding-left: 1rem;
`;

interface IHeader {
  label: string;
  children: ReactNode;
}

const Header = ({ label, children }: IHeader) => (
  <TopBar>
    <MainLabel>{ label }</MainLabel>
    { children }
  </TopBar>
);

export default memo(Header);
