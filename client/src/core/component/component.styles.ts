import styled, { css } from 'styled-components';
import { device } from '../theme/main.theme';

export const SliderContainer = styled.div``;

const rangeThumb = css`
    height: 32px;
    width: 32px;
    background: #fff;
    border: 2px solid #C4C4C4;
    border-radius: 20px;
    cursor: pointer;
    margin-top: -13px;
`;

export const CommonInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    ${rangeThumb}
  };

  &::-moz-range-thumb {
    ${rangeThumb}
  };

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: #C4C4C4;
  }

  &::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: #C4C4C4;
  }


  &:focus {
    outline: none;
  }
`;

export const MeasurementContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media ${device.tablet} {
    display: block;
  }
`;
