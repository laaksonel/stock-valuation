import * as React from 'react';
import { IAppState } from '../app.reducer';
import { connect } from 'react-redux';
import StockMeasurementBox from '../../core/component/StockMeasurementBox';
import styled from 'styled-components';
import StockValuationResult from './result/StockValuationResult';
import { StockData } from './stock.reducer';

const MainInputContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const MeasurementBoxContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;

export interface StockValuationParams {
  valuationData: StockData;
  discount: number;
  marginOfSafety: number;
}

class StockValuationPage extends React.Component<StockValuationParams, StockValuationParams> {

  constructor(props: StockValuationParams) {
    super(props);
    this.state = {
      ...props
    }
  }

  private replaceValuationData = (key: keyof StockData, value: number) => {
    const valuationData = {
      ...this.state.valuationData,
      [key]: value,
    };

    this.setState({
      ...this.state,
      valuationData,
    });
  }

  public render() {
    const stockData = this.state.valuationData;

    const buildDataInput = (k: keyof StockData) =>
      createMeasurement(k, stockData[k], this.replaceValuationData);

    const stockDataInputs = Object.keys(stockData)
      .map((k) => k as keyof StockData) // This holds as long as Object.keys is used
      .map((k) => buildDataInput(k));

    return (
      <React.Fragment>
        <MainInputContainer>
          <MeasurementBoxContainer>
            { stockDataInputs }
          </MeasurementBoxContainer>
        </MainInputContainer>

        <StockValuationResult
          valuationData={this.state.valuationData}
          discount={this.state.discount}
          marginOfSafety={this.state.marginOfSafety}
        />
      </React.Fragment>
    );
  }
};

type StockDataKey = keyof StockData;

function createMeasurement(key: StockDataKey, currentValue: number, callback: (k: StockDataKey, v: number) => void) {
  return (
    <StockMeasurementBox
      title={translations[key]}
      valueName={key}
      currentValue={currentValue}
      onChange={(x) => callback(key, x)}
    />
  );
}

type TranslationDictionary = {
  [_: string]: string
}

const translations: TranslationDictionary = {
  eps: 'EPS',
  expectedGrowth: 'Expected growth',
  fiveYearPE: 'Five year PE',
}

export default StockValuationPage;