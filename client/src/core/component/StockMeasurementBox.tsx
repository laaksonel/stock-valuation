import * as React from 'react';
import styled from 'styled-components';

const MeasurementContainer = styled.div`
  display: inline-block;
`

interface IStockMeasurementBox {
  title: string;
  valueName: string;
  currentValue: number;
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
      currentValue,
      valueName,
    } = this.props;

    return (
      <MeasurementContainer>
        <div>{title}</div>
        <input type='number'
          name={valueName}
          value={currentValue}
          onChange={this.changeValue}
        />
      </MeasurementContainer>
    );
  }
}