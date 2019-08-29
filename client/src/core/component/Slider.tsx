import * as React from 'react';
import styled from 'styled-components';

export const SliderContainer = styled.div`
`;

const CommonInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 32px;
    width: 32px;
    background: #fff;
    border: 2px solid #C4C4C4;
    border-radius: 16px;
    cursor: pointer;
    margin-top: -13px;
  };

  &::-moz-range-thumb {
    height: 32px;
    width: 32px;
    background: #fff;
    border: 1px solid #000;
    border-radius: 8px;
    cursor: pointer;
  };

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: #C4C4C4;
  }

  &:focus {
    outline: none;
  }
`;

interface SliderProps {
  name: string;
  initialValue: number;
  onChange: (value: number) => void;
}

interface SlideState {
  value: number;
}

export default class Slider extends React.Component<SliderProps, SlideState> {

  constructor(props: SliderProps) {
    super(props);
    this.state = {
      value: props.initialValue,
    };
  }

  onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    if (!Number.isNaN(value)) {
      this.props.onChange(value);
    }

    this.setState({
      value,
    });
  }

  public render() {
    return (
      <SliderContainer>
        <CommonInput
          type="range"
          name={this.props.name}
          min={0}
          max={100}
          value={this.state.value}
          onChange={this.onValueChanged}
        />
      </SliderContainer>
    );
  }
}
