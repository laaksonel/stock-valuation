import styled from 'styled-components';
import { SliderContainer } from '../../core/component/Slider';
import { device } from '../../core/theme/mainTheme';

export const StockDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2%;
`;

export const InputContainer = styled.div`
  width: 85%;

  display: flex;
  flex-direction: column;
  align-self: center;
  padding-top: 2%;
  padding-bottom: 2%;
`;

export const MeasurementBoxContainer = styled(InputContainer)`
  @media ${device.tablet} {
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
