import * as React from 'react';
import {
  ResultSection,
  ResultContainer,
  ValueContainer,
  MainTitle,
  Value,
  ValueName,
  FinalEstimate,
} from './resultStyles';
import { StockValuationParams, StockValuationMultipliers } from '../../stockEntity';
import { StockValuation, calculateValuation } from '../valueCalculation';

interface StockValuationResultProps extends StockValuationParams {
  currentPrice: number | undefined;
  multipliers: StockValuationMultipliers;
}

export default class StockValuationResult extends React.Component<StockValuationResultProps> {
  private valuation: StockValuation;

  constructor(props: StockValuationResultProps) {
    super(props);
    this.valuation = calculateValuation(props);
  }

  componentWillUpdate() {
    this.valuation = calculateValuation(this.props);
  }

  render() {
    const {
      valueInFiveYears,
      todayIntrinsicValue,
    } = this.valuation;

    return (
      <ResultSection>
          <ResultContainer gridArea="estimate">
            <MainTitle>Estimates</MainTitle>
            <ValueContainer>
              <ValueName>Five years</ValueName>
              <Value>{ valueInFiveYears.toFixed(2) }</Value>
            </ValueContainer>
            <ValueContainer>
              <ValueName>Today</ValueName>
              <Value>{ todayIntrinsicValue.toFixed(2) }</Value>
            </ValueContainer>
          </ResultContainer>

          <ResultContainer gridArea="current-price">
            <ValueContainer>
              <ValueName>Current price</ValueName>
              <Value>{ this.props.currentPrice }</Value>
            </ValueContainer>
          </ResultContainer>
          <ResultContainer gridArea="final-estimate"> {
            this.props.currentPrice &&
             <FinalEstimate>{
               this.props.currentPrice < todayIntrinsicValue
                ? 'Undervalued'
                : 'Overvalued'
            }</FinalEstimate>
          }
          </ResultContainer>
      </ResultSection>
    );
  }
}
