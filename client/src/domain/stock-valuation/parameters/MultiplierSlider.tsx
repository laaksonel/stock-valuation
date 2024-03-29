import * as React from 'react';
import { StockMultiplierKey } from '../../entity/stock.entity';
import { MultiplierContainer, MultiplierInputContainer } from '../input.styles';
import { Input, InputHeader } from '../../../core/theme/main.theme';
import Slider from '../../../core/component/Slider';
import { translations } from '../../entity/stock.translation';

interface MultiplierSliderProps {
  initialValue: number;
  sliderId: StockMultiplierKey;
  updateMultipliers: (k: StockMultiplierKey, v: number) => void;
}

interface MultiplierSliderState {
  currentValue: number;
}

export default class MultiplierSlider extends React.Component<MultiplierSliderProps, MultiplierSliderState> {
  constructor(props: MultiplierSliderProps) {
    super(props);
    this.state = {
      currentValue: props.initialValue,
    };
  }

  private updateValues = (v: number) => {
    this.props.updateMultipliers(this.props.sliderId, v);
    this.setState({
      currentValue: v,
    });
  }

  render() {
    const {
      sliderId: key,
    } = this.props;

    return (
      <div>
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
