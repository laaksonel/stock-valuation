import styled from 'styled-components';
import { device } from '../theme/main.theme';

export const TopBar = styled.div`
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

export const MainLabel = styled.div`
  color: #E50914;
  font-weight: 500;
  font-size: 24px;
  padding-bottom: 10px;

  @media ${device.tablet} {
    padding-bottom: 0;
  }
`;

export const HeaderSlot = styled.div`
  flex: 1;
`;

export const MiddleSlot = styled(HeaderSlot)`
  display: flex;
  justify-content: center;
`;

export const MainContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
