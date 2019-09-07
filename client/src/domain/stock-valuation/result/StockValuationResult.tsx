import * as React from 'react';
import { connect } from 'react-redux';
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
import { hasValue } from '../valueCalculation';
import { IAppState } from '../../app.reducer';
import { getValuationResults, ValuationResult, OptionalNumber } from '../stock.reducer';

class StockValuationResult extends React.Component<ValuationResult> {
  public render() {
    const {
      currentPrice,
      valueInFiveYears,
      todayIntrinsicValue,
    } = this.props;

    return (
      <ResultSection>
          <ResultContainer gridArea="estimate">
            <MainTitle>Estimates</MainTitle>
            <ValueContainer>
              <ValueName>Five years</ValueName>
              <Value>{ formatResult(valueInFiveYears) }</Value>
            </ValueContainer>
            <ValueContainer>
              <ValueName>Today</ValueName>
              <Value>{ formatResult(todayIntrinsicValue) }</Value>
            </ValueContainer>
          </ResultContainer>

          <ResultContainer gridArea="current-price">
            <ValueContainer>
              <ValueName>Current market price</ValueName>
              <Value>{ currencyPrefix(currentPrice) }</Value>
            </ValueContainer>
          </ResultContainer>
          <FinalResultContainer gridArea="final-estimate">
            { createFinalEstimate(currentPrice, todayIntrinsicValue) }
          </FinalResultContainer>
      </ResultSection>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return getValuationResults(state.stock);
};

export default connect(mapStateToProps)(StockValuationResult);

const currencyPrefix = (value: OptionalNumber): string => value
  ? `$${value}`
  : '-';

const createFinalEstimate = (currentPrice: OptionalNumber, todayIntrinsicValue: OptionalNumber) => {
  if (currentPrice && todayIntrinsicValue) {
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

  return '-';
};

const formatResult = (x: OptionalNumber) =>
  runIfPresent(x, twoDecimals, '-');

const runIfPresent = (
  x: OptionalNumber,
  formatter: (_: number) => string,
  orElse: string,
) => hasValue(x)
     ? formatter(x)
     : orElse;

const twoDecimals = (x: number) => `$${x.toFixed(2)}`;
