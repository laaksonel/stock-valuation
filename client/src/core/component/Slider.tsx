import * as React from 'react';
import styled from 'styled-components';

export const SliderContainer = styled.div`
`
export const CommonInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`

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
    }
  }

  onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    if (!Number.isNaN(value)) {
      this.props.onChange(value);
    }

    this.setState({
      value
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
