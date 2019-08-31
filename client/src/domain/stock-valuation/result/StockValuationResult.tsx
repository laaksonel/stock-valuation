import * as React from 'react';
import {
  ResultSection,
  ResultContainer,
  ValueContainer,
  MainTitle,
  Value,
  ValueName,
  FinalEstimate,
  FinalResultContainer,
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
              <Value>${ valueInFiveYears.toFixed(2) }</Value>
            </ValueContainer>
            <ValueContainer>
              <ValueName>Today</ValueName>
              <Value>${ todayIntrinsicValue.toFixed(2) }</Value>
            </ValueContainer>
          </ResultContainer>

          <ResultContainer gridArea="current-price">
            <ValueContainer>
              <ValueName>Current market price</ValueName>
              <Value>${ this.props.currentPrice }</Value>
            </ValueContainer>
          </ResultContainer>
          <FinalResultContainer gridArea="final-estimate">
            { createFinalEstimate(this.props.currentPrice, todayIntrinsicValue) }
          </FinalResultContainer>
      </ResultSection>
    );
  }
}

const createFinalEstimate = (currentPrice: number | undefined, todayIntrinsicValue: number) => {
  if (currentPrice) {
    const isUndervalued = currentPrice < todayIntrinsicValue;
    return (
      <FinalEstimate color={isUndervalued ? 'green' : 'red'}>
      {
          isUndervalued
            ? 'Undervalued'
            : 'Overvalued'
      }
      </FinalEstimate>
    );
  }

  return null;
};

