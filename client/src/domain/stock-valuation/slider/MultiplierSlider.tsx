import * as React from 'react';
import { StockMultiplierKey } from '../../stockEntity';
import { MultiplierContainer, MultiplierInputContainer } from '../stockInputStyles';
import { Input, InputHeader } from '../../../core/theme/mainTheme';
import Slider from '../../../core/component/Slider';
import { translations } from '../../stockTranslation';

interface MultiplierSliderProps {
  initialValue: number;
  sliderId: StockMultiplierKey;
  updateMultipliers: (k: StockMultiplierKey, v: number) => void;
}

interface MultiplierSliderState {
  currentValue: number;
}

export default class MultiplierSlider extends React.Component<MultiplierSliderProps, MultiplierSliderState> {
  private updateValues = (v: number) => {
    this.props.updateMultipliers(this.props.sliderId, v);
    this.setState({
      currentValue: v,
    });
  }

  constructor(props: MultiplierSliderProps) {
    super(props);
    this.state = {
      currentValue: props.initialValue,
    };
  }

  render() {
    const {
      sliderId: key,
    } = this.props;

    return (
      <div key={key}>
        <InputHeader>{ translations[key] }</InputHeader>
        <MultiplierContainer>
          <Slider
            initialValue={this.state.currentValue}
            name={key}
            onChange={this.updateValues}
          />
          <MultiplierInputContainer>
            <Input
              placeholder="%"
              width="100%"
              type="numeric"
              value={this.state.currentValue}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => this.updateValues(+ev.target.value)}
            />
          </MultiplierInputContainer>
        </MultiplierContainer>
      </div>
    );
  }
}
