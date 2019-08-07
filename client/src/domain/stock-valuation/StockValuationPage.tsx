import * as React from 'react';
import { IAppState } from '../app.reducer';
import { connect } from 'react-redux';

class StockValuationPage extends React.Component<StateProps> {
  public render() {

    const stockData = this.props.selectedStockData;

    return stockData && (
      <div>
        <span>{ stockData.eps }</span>
        <span>{ stockData.fiveYearPE }</span>
        <span>{ stockData.expectedGrowth }</span>
      </div>
    ) || null;
  }
}

const mapStateToProps = (state: IAppState) => state.stock;

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(StockValuationPage);