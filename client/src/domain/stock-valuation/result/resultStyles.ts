import styled from 'styled-components';
import { device } from '../../../core/theme/stockTheme';

export interface ResultContainerProps {
  gridArea: string;
}

export const ResultContainer = styled.div`
  border: 1px solid #CCCCCC;
  border-radius: 2px;
  grid-area: ${(props: ResultContainerProps) => props.gridArea };
  margin-top: 5%;
  padding: 5.5%;
`;

export const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 7.5%;

  @media ${device.mobileM} {
    display: grid;

    grid-template-columns: 49% 49%;
    grid-column-gap: 2%;
    grid-template-areas:
      'estimate current-price'
      'estimate final-estimate';

    align-self: center;
    width: 75%;
    padding: 0%;
  }
`;

export const FinalResultContainer = styled(ResultContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MainTitle = styled.span`
  font-size: 32px;
  font-family: 'Roboto Medium', sans-serif;
`;
export const ValueContainer = styled.div`
  padding-top: 2%;
  padding-bottom: 2%;
`;
export const ValueName = styled.div`
  font-size: 20px;
`;

export const Value = styled.div`
  font-size: 32px;
  font-family: 'Roboto Medium', sans-serif;
`;

interface ColorProp {
  color: string;
}

export const FinalEstimate = styled.div`
  font-size: 32px;
  grid-area: final-estimate;
  color: ${(props: ColorProp) => props.color}
`;
