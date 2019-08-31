import React, { Fragment } from 'react';
import Header from './core/layout/Header';
import MainContent from './core/layout/MainContent';
import TickerSearch from './domain/stock-search/TickerSearch';
import styled, { createGlobalStyle } from 'styled-components';
import StockValuationPage from './domain/stock-valuation/StockValuationPage';

const DefaultTheme = {
  backgroundColor: '#E5E5E5',
};

const GlobalStyle = createGlobalStyle<typeof DefaultTheme>`
  body {
    background-color: ${props => props.backgroundColor};
  }
`;

class App extends React.Component {
  public render() {
    return (
      <>
          <GlobalStyle {...DefaultTheme} />
          <Header label="Stock valuator">
            <TickerSearch />
          </Header>
          <MainContent>
            <StockValuationPage />
          </MainContent>
      </>
    );
  }
}

export default App;
