import React, { Fragment } from 'react';
import Header from './core/layout/Header';
import MainContent from './core/layout/MainContent';
import TickerSearch from './domain/stock-search/TickerSearch';
import { createGlobalStyle } from 'styled-components';
import StockValuationPage from './domain/stock-valuation/StockValuationPage';
import { IAppState } from './domain/app.reducer';
import { connect } from 'react-redux';

const DefaultTheme = {
  backgroundColor: '#E5E5E5',
};

const GlobalStyle = createGlobalStyle<typeof DefaultTheme>`
  body {
    background-color: ${props => props.backgroundColor};
  }
`;

class App extends React.Component<StateProps> {
  public render() {
    const currentView = this.props.selectedStockData && this.props.currentPrice
      ? <StockValuationPage
          valuationData={this.props.selectedStockData}
          currentPrice={this.props.currentPrice}
          multipliers= {{
            discount: 10,
            marginOfSafety: 10,
          }}
        />
      : <span>No stock currently selected</span>;

    return (
      <Fragment>
          <GlobalStyle {...DefaultTheme} />
          <Header label="Stock valuator">
            <TickerSearch />
          </Header>
          <MainContent>
            { currentView }
          </MainContent>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => state.stock;

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(App);
