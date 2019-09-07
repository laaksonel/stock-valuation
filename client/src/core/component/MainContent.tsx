import React from 'react';
import { MainContentDiv } from './layout.styles';

export default class MainContent extends React.PureComponent {
  public render() {
    return (
      <MainContentDiv>
        { this.props.children }
      </MainContentDiv>
    );
  }
}
