import styled from 'styled-components';

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopM: '1280px',
  laptopL: '1440px',
  desktop: '2560px',
};

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopM: `(min-width: ${size.laptopM})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
};

export interface InputProps {
  width: string;
}

export const Input = styled.input`
  border: 1px solid #aaa;
  border-radius: 5px;
  height: 35px;
  padding-left: 5px;
  font-size: 24px;
  width: 100px;
  max-width: 100%;

  @media ${device.mobileL} {
    width: 150px;
  }

  box-sizing: border-box;
`;

export const InputHeader = styled.h4`
  margin-block-start: 10px;
  margin-block-end: 10px;
  font-weight: normal;
  font-size: 20px;
  color: #333333;
  font-family: 'Roboto', sans-serif;
`;

