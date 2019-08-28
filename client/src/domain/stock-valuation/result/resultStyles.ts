import styled from 'styled-components';

export interface ResultContainerProps {
  gridArea: string;
}

export const ResultContainer = styled.div`
  border: 1px solid #CCCCCC;
  grid-area: ${(props: ResultContainerProps) => props.gridArea };
  margin-top: 5%;
  padding: 4%;
`;

export const ResultSection = styled.div`
  display: grid;

  grid-template-columns: 49% 49%;
  grid-column-gap: 2%;
  grid-template-areas:
    'estimate current-price'
    'estimate final-estimate';

  align-self: center;
  width: 75%;
`;

export const MainTitle = styled.span`
  font-size: 32px;
`;
export const ValueContainer = styled.div`

`;
export const ValueName = styled.div`
  font-size: 20px;
`;

export const Value = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

interface ColorProp {
  color: string;
}

export const FinalEstimate = styled.div`
  font-size: 48px;
  text-align: center;
  grid-area: final-estimate;
  color: ${(props: ColorProp) => props.color}
`;
