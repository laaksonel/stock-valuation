import styled from "styled-components";
import { SliderContainer } from "../../core/component/Slider";

export const StockDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2%;
  border-bottom: 1px solid black;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  align-self: center;
`

export const MeasurementBoxContainer = styled(InputContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
`;

export const MultiplierContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${SliderContainer} {
    flex-grow: 1;
  }
`
export const MultiplierInputContainer = styled.div`
  width: 10%;
  margin-left: 5%;
  box-sizing: border-box;
`