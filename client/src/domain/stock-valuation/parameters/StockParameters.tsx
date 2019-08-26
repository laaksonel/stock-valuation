import * as React from 'react';
import { StockMultiplierKey, StockValuationParams } from '../../stockEntity';
import { StockData } from '../stock.reducer';
import { StockDataContainer, InputContainer, MeasurementBoxContainer } from '../stockInputStyles';
import StockMeasurementBox from '../../../core/component/StockMeasurementBox';
import { translations } from '../../stockTranslation';

interface StockParameterProps {
  onUpdateValuationData: (key: keyof StockData, value: number)    => void;
  onMultiplierChange:    (key: StockMultiplierKey, value: number) => void;
  data: StockValuationParams;
}

export default class StockParameters extends React.Component {
  public render() {
    const {
      valuationData,
      multipliers,
    } = this.props;

    const buildDataInput = (k: keyof StockData) =>
      createMeasurement(k, valuationData[k], this.replaceValuationData);

    const stockDataInputs = Object.keys(valuationData)
      .map(k => k as keyof StockData) // This holds as long as Object.keys is used
      .map(k => buildDataInput(k));

    const multiplierSliders = Object.keys(multipliers)
      .map(k => k as StockMultiplierKey)
      .map(k => createMultiplierSliders(k, multipliers[k], this.onMultipliersChange));

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
function createMeasurement(key: StockDataKey, initialValue: number, callback: (k: StockDataKey, v: number) => void) {
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
