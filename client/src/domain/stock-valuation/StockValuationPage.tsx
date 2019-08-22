import * as React from 'react';
import StockMeasurementBox from '../../core/component/StockMeasurementBox';
import styled from 'styled-components';
import StockValuationResult from './result/StockValuationResult';
import { StockData } from './stock.reducer';
import Slider, { CommonInput, SliderContainer } from '../../core/component/Slider';
import { MultiplierContainer, MultiplierInputContainer, StockDataContainer, InputContainer, MeasurementBoxContainer } from './stockInputStyles';
import { InputHeader, Input } from '../../core/theme/stockTheme';
import { StockValuationParams, StockMultiplierKey } from '../stockEntity';
import { translations } from '../stockTranslation';
import MultiplierSlider from './slider/MultiplierSlider';

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

  private onMultipliersChange = (key: StockMultiplierKey, value: number) => {
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
      .map((k) => k as StockMultiplierKey)
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

function createMultiplierSliders(key: StockMultiplierKey, initialValue: number, callback: (k: StockMultiplierKey, v: number) => void) {
  return (
    <MultiplierSlider
      initialValue={initialValue}
      sliderId={key}
      updateMultipliers={callback}
    />
  );
}

export default StockValuationPage;