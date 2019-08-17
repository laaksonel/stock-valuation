import * as React from 'react';
import { StockData } from '../stock.reducer';
import { StockValuationParams } from '../StockValuationPage';

export default class StockValuationResult extends React.Component<StockValuationParams> {
  public render() {
    return (
      <div>
        {JSON.stringify(this.props)}
      </div>
    );
  }
}
