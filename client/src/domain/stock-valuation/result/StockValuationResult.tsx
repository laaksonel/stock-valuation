import * as React from 'react';
import { StockData } from '../stock.reducer';
import { StockValuationParams } from '../StockValuationPage';
import { ResultSection, ResultContainer, ValueContainer, MainTitle, Value, ValueName, FinalEstimate } from './resultStyles';


export default class StockValuationResult extends React.Component<StockValuationParams> {
  public render() {
    return (
      <ResultSection>
          <ResultContainer gridArea='estimate'>
            <MainTitle>Estimates</MainTitle>
            <ValueContainer>
              <ValueName>Five years</ValueName>
              <Value>$999</Value>
            </ValueContainer>
            <ValueContainer>
              <ValueName>Today</ValueName>
              <Value>$999</Value>
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
