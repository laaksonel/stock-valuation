import * as React from 'react';
import styled from 'styled-components';

const MainContentDiv = styled.div`
  margin-top: 4rem;
  margin-right: 28rem;
  margin-left: 28rem;
  background-color: white;
  border-radius: 5px;
  padding: 3%;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
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
