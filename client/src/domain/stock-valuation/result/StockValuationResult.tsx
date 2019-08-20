import * as React from 'react';
import { StockData } from '../stock.reducer';
import { StockValuationParams } from '../StockValuationPage';
import { ResultSection, ResultContainer, ValueContainer, MainTitle, Value, ValueName, FinalEstimate } from './resultStyles';
import { calculateValuation, StockValuation } from '../../../core/service/valueCalculation';


export default class StockValuationResult extends React.Component<StockValuationParams> {
  private readonly valuation: StockValuation;

  constructor(props: StockValuationParams) {
    super(props);
    this.valuation = calculateValuation(props);
  }

  public render() {
    return (
      <ResultSection>
          <ResultContainer gridArea='estimate'>
            <MainTitle>Estimates</MainTitle>
            <ValueContainer>
              <ValueName>Five years</ValueName>
              <Value>{ this.valuation.valueInFiveYears }</Value>
            </ValueContainer>
            <ValueContainer>
              <ValueName>Today</ValueName>
              <Value>{ this.valuation.todayIntrinsicValue }</Value>
            </ValueContainer>
          </ResultContainer>

          <ResultContainer gridArea='current-price'>
            <ValueContainer>
              <ValueName>Current price</ValueName>
              <Value>$999</Value>
            </ValueContainer>
          </ResultContainer>
          <ResultContainer gridArea='final-estimate'>
            <FinalEstimate>Overvalued</FinalEstimate>
          </ResultContainer>
      </ResultSection>
    );
  }
}
