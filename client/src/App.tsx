import React from 'react';
import Header from './core/component/Header';
import TickerSearch from './domain/stock-search/TickerSearch';
import StockValuationPage from './domain/stock-valuation/StockValuationPage';
import MainContent from './core/component/MainContent';
import { GlobalStyle, DefaultTheme } from './core/theme/main.theme';

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
