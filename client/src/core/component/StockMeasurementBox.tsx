import * as React from 'react';
import styled from 'styled-components';
import { InputHeader, Input, device } from '../theme/stockTheme';

const MeasurementContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media ${device.laptopM} {
    display: block;
  }
`;

interface IStockMeasurementBox {
  title: string;
  valueName: string;
  initialValue: number;
  onChange: (newValue: number) => void;
}

export default class StockMeasurementBox extends React.Component<IStockMeasurementBox> {
  private changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = +e.target.value;
    if (!Number.isNaN(v)) {
      this.props.onChange(v);
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
          value={currentValue}
          onChange={this.changeValue}
        />
      </MeasurementContainer>
    );
  }
}
