import * as React from 'react';
import { InputHeader, Input } from '../../../core/theme/main.theme';
import { MeasurementContainer } from '../../../core/component/component.styles';

interface IStockMeasurementBox {
  title: string;
  valueName: string;
  value?: number;
  onChange: (newValue: number | undefined) => void;
}

export default class StockMeasurementBox extends React.Component<IStockMeasurementBox> {
  private changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const isValidNumber = !Number.isNaN(+rawValue);
    const isEmpty = rawValue === '';

    if (isValidNumber || isEmpty) {
      const finalValue = isEmpty
        ? undefined
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
          value={value !== undefined ? value : ''}
          onChange={this.changeValue}
        />
      </MeasurementContainer>
    );
  }
}
