import * as React from 'react';
import { StockMultiplierKey, StockValuationMultipliers } from '../../stockEntity';
import { StockData } from '../stock.reducer';
import { StockDataContainer, InputContainer, MeasurementBoxContainer } from '../stockInputStyles';
import StockMeasurementBox from '../../../core/component/StockMeasurementBox';
import { translations } from '../../stockTranslation';
import MultiplierSlider from '../slider/MultiplierSlider';

interface StockParameterProps {
  onUpdateValuationData: (key: keyof StockData, value: number | undefined) => void;
  onMultiplierChange:    (key: StockMultiplierKey, value: number) => void;
  data: StockData;
  multipliers: StockValuationMultipliers;
}

export default class StockParameters extends React.Component<StockParameterProps> {
  public render() {
    const {
      onUpdateValuationData,
      onMultiplierChange,
    } = this.props;

    const {
      data,
      multipliers,
    } = this.props;


    const buildDataInput = (k: keyof StockData) =>
      createMeasurement(k, data[k], onUpdateValuationData);

    const stockDataInputs = Object.keys(data)
      .map(k => k as keyof StockData) // This holds as long as Object.keys is used
      .map(k => buildDataInput(k));

    const multiplierSliders = Object.keys(multipliers)
      .map(k => k as StockMultiplierKey)
      .map(k => createMultiplierSliders(k, multipliers[k], onMultiplierChange));

    return (
      <StockDataContainer>
        <MeasurementBoxContainer>
          { stockDataInputs }
        </MeasurementBoxContainer>
        <InputContainer>
          { multiplierSliders }
        </InputContainer>
      </StockDataContainer>
    );
  }
}

type StockDataKey = keyof StockData;
function createMeasurement(
  key: StockDataKey,
  initialValue: number | undefined,
  callback: (k: StockDataKey, v: number | undefined) => void,
) {
  return (
    <StockMeasurementBox
      key={key}
      title={translations[key]}
      valueName={key}
      initialValue={initialValue}
      onChange={x => callback(key, x)}
    />
  );
}

function createMultiplierSliders(
  key: StockMultiplierKey,
  initialValue: number,
  callback: (k: StockMultiplierKey, v: number) => void,
) {
  return (
    <MultiplierSlider
      initialValue={initialValue}
      sliderId={key}
      updateMultipliers={callback}
    />
  );
}
