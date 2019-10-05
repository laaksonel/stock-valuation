import * as React from 'react';
import { StockMultiplierKey, StockValuationMultipliers } from '../../entity/stock.entity';
import { StockData, OptionalNumber, StockDataKey } from '../stock.reducer';
import { StockDataContainer, InputContainer, MeasurementBoxContainer } from '../input.styles';
import StockMeasurementBox from './StockMeasurementBox';
import { translations } from '../../entity/stock.translation';
import MultiplierSlider from './MultiplierSlider';

interface StockParameterProps {
  onUpdateValuationData: (key: StockDataKey, value: OptionalNumber) => void;
  onMultiplierChange:    (key: StockMultiplierKey, value: number) => void;
  data: StockData;
  multipliers: StockValuationMultipliers;
}

export default class StockParameters extends React.Component<StockParameterProps> {
  public render() {
    const {
      onUpdateValuationData,
      onMultiplierChange,
      data,
      multipliers,
    } = this.props;

    const buildDataInput = (k: StockDataKey) =>
      createMeasurement(k, data[k], onUpdateValuationData);

    const stockDataInputs = Object.keys(data)
      .map(k => k as StockDataKey) // This holds as long as Object.keys is used
      .map(k => buildDataInput(k));

    const multiplierSliders = Object.keys(multipliers)
      .map(k => k as StockMultiplierKey)
      .map(k => createMultiplierSliders(k, multipliers[k], onMultiplierChange));

    return (
      <StockDataContainer>
        <MeasurementBoxContainer noValidate>
          { stockDataInputs }
        </MeasurementBoxContainer>
        <InputContainer>
          { multiplierSliders }
        </InputContainer>
      </StockDataContainer>
    );
  }
}

function createMeasurement(
  key: StockDataKey,
  initialValue: OptionalNumber,
  callback: (k: StockDataKey, v: OptionalNumber) => void,
) {
  return (
    <StockMeasurementBox
      key={key}
      title={translations[key]}
      valueName={key}
      value={initialValue}
      onChange={x => callback(key, x)}
    />
  );
}

const createMultiplierSliders = (
  key: StockMultiplierKey,
  initialValue: number,
  callback: (k: StockMultiplierKey, v: number) => void,
) => (
  <MultiplierSlider
    key={key}
    initialValue={initialValue}
    sliderId={key}
    updateMultipliers={callback}
  />
);
