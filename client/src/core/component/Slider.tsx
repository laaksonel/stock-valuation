import * as React from 'react';
import { SliderContainer, CommonInput } from './component.styles';

interface SliderProps {
  name: string;
  initialValue: number;
  onChange: (value: number) => void;
}

export default class Slider extends React.PureComponent<SliderProps> {
  private onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    if (!Number.isNaN(value)) {
      this.props.onChange(value);
    }
  }

  public render() {
    return (
      <SliderContainer>
        <CommonInput
          type="range"
          name={this.props.name}
          min={0}
          max={100}
          value={this.props.initialValue}
          onChange={this.onValueChanged}
        />
      </SliderContainer>
    );
  }
}
