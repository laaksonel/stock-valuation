import * as React from 'react';
import styled from 'styled-components';

const MainContentDiv = styled.div`
  margin-top: 4rem;
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
