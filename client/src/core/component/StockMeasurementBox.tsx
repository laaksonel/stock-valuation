import * as React from 'react';
import styled from 'styled-components';
import { InputHeader, Input, device } from '../theme/stockTheme';

const MeasurementContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media ${device.tablet} {
    display: block;
  }
`;

interface IStockMeasurementBox {
  title: string;
  valueName: string;
  initialValue?: number;
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
      initialValue: currentValue,
      valueName,
    } = this.props;
    return (
      <MeasurementContainer>
        <InputHeader>{title}</InputHeader>
        <Input
          width="150px"
          type="number"
          name={valueName}
          value={currentValue !== undefined ? currentValue : ''}
          onChange={this.changeValue}
        />
      </MeasurementContainer>
    );
  }
}
