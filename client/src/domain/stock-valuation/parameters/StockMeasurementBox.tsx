import * as React from 'react';
import { InputHeader, Input } from '../../../core/theme/main.theme';
import { MeasurementContainer } from '../../../core/component/component.styles';
import { OptionalNumber } from '../stock.reducer';

interface IStockMeasurementBox {
  title: string;
  valueName: string;
  value: OptionalNumber;
  onChange: (newValue: OptionalNumber) => void;
}

export default class StockMeasurementBox extends React.Component<IStockMeasurementBox> {
  private changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const isValidNumber = !Number.isNaN(+rawValue);
    const isEmpty = rawValue === '';

    if (isValidNumber || isEmpty) {
      const finalValue = isEmpty
        ? null
        : +rawValue;
      this.props.onChange(finalValue);
    }
  }

  public render() {
    const {
      title,
      value,
      valueName,
    } = this.props;

    return (
      <MeasurementContainer>
        <InputHeader>{title}</InputHeader>
        <Input
          width="150px"
          type="number"
          name={valueName}
          value={value !== null ? value : ''}
          onChange={this.changeValue}
        />
      </MeasurementContainer>
    );
  }
}
