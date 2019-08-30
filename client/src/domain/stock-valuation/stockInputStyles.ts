import styled from 'styled-components';
import { SliderContainer } from '../../core/component/Slider';
import { device } from '../../core/theme/stockTheme';

export const StockDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2%;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  align-self: center;
  padding-top: 2%;
  padding-bottom: 2%;
`;

export const MeasurementBoxContainer = styled(InputContainer)`
  @media ${device.laptopM} {
    flex-direction: row;
  }
  justify-content: space-between;
  align-self: center;
`;

export const MultiplierContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${SliderContainer} {
    flex-grow: 1;
  }
`;
export const MultiplierInputContainer = styled.div`
  margin-left: 5%;
  box-sizing: border-box;
  width: 60px;
`;
