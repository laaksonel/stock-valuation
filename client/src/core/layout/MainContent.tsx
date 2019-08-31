import * as React from 'react';
import styled from 'styled-components';
import { device } from '../theme/stockTheme';

const MainContentDiv = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default class MainContent extends React.Component {
  public render() {
    return (
      <MainContentDiv>
        { this.props.children }
      </MainContentDiv>
    );
  }
}
