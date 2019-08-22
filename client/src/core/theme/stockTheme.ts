import styled from "styled-components";

export interface InputProps {
  width: string;
}

export const Input = styled.input`
  border: 1px solid #aaa;
  border-radius: 5px;
  height: 35px;
  padding-left: 5px;
  font-size: 24px;
  width: ${(props: InputProps) => props.width};
  box-sizing: border-box;
`

export const InputHeader = styled.h4`
  margin-block-start: 10px;
  margin-block-end: 10px;
`