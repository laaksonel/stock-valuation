import * as React from 'react';
import StockMeasurementBox from '../../core/component/StockMeasurementBox';
import styled from 'styled-components';
import StockValuationResult from './result/StockValuationResult';
import { StockData } from './stock.reducer';
import Slider, { CommonInput, SliderContainer } from '../../core/component/Slider';

const StockDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2%;
  border-bottom: 1px solid black;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  align-self: center;
`

const MeasurementBoxContainer = styled(InputContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
`;

export interface StockValuationParams {
  valuationData: StockData;
  currentPrice: number;
  multipliers: StockValuationMultipliers;
}

interface StockValuationMultipliers {
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

  private onMultipliersChange = (key: keyof StockValuationMultipliers, value: number) => {
    const multipliers = {
      ...this.state.multipliers,
      [key]: value,
    };

    this.setState({
      ...this.state,
      multipliers,
    });
  }

  public render() {
    const {
      valuationData,
      multipliers,
      currentPrice
    }= this.state

    const buildDataInput = (k: keyof StockData) =>
      createMeasurement(k, valuationData[k], this.replaceValuationData);

    const stockDataInputs = Object.keys(valuationData)
      .map((k) => k as keyof StockData) // This holds as long as Object.keys is used
      .map((k) => buildDataInput(k));

    const multiplierSliders = Object.keys(multipliers)
      .map((k) => k as keyof StockValuationMultipliers)
      .map((k) => createMultiplierSliders(k, multipliers[k], this.onMultipliersChange));

    return (
      <React.Fragment>
        <StockDataContainer>
          <MeasurementBoxContainer>
            { stockDataInputs }
          </MeasurementBoxContainer>
          <InputContainer>
            { multiplierSliders }
          </InputContainer>
        </StockDataContainer>

        <StockValuationResult
          valuationData={valuationData}
          currentPrice={currentPrice}
          multipliers={multipliers}
        />
      </React.Fragment>
    );
  }
};

type StockDataKey = keyof StockData;
function createMeasurement(key: StockDataKey, initialValue: number, callback: (k: StockDataKey, v: number) => void) {
  return (
    <StockMeasurementBox
      key={key}
      title={translations[key]}
      valueName={key}
      initialValue={initialValue}
      onChange={(x) => callback(key, x)}
    />
  );
}

const MultiplierContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${SliderContainer} {
    flex-grow: 1;
  }
`
const MultiplierInputContainer = styled.div`
  width: 10%;
  margin-left: 5%;
  box-sizing: border-box;
`

type StockMultiplierKey = keyof StockValuationMultipliers
function createMultiplierSliders(key: StockMultiplierKey, initialValue: number, callback: (k: StockMultiplierKey, v: number) => void) {
  return (
    <div key={key}>
      <h4>{ translations[key] }</h4>
      <MultiplierContainer>
        <Slider
          initialValue={initialValue}
          name={key}
          onChange={(x) => callback(key, x)} />
        <MultiplierInputContainer>
          <CommonInput type='numeric' />
        </MultiplierInputContainer>
      </MultiplierContainer>
    </div>
  );
}

type TranslationDictionary = {
  [_: string]: string
}

const translations: TranslationDictionary = {
  eps: 'EPS',
  expectedGrowthRatePercent: 'Expected growth',
  averageFiveYearPE: 'Five year PE',
  marginOfSafety: 'Margin of safety',
  discount: 'Discount'
}

export default StockValuationPage;