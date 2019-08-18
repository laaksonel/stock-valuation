import * as React from 'react';
import { StockData } from '../stock.reducer';
import { StockValuationParams } from '../StockValuationPage';
import styled from 'styled-components';

interface ResultContainerProps {
  gridArea: string;
}
const ResultContainer = styled.div`
  border: 1px solid #CCCCCC;
  grid-area: ${(props: ResultContainerProps) => props.gridArea };
  margin-top: 5%;
`

const ResultSection = styled.div`
  display: grid;

  grid-template-columns: 49% 49%;
  grid-column-gap: 2%;
  grid-template-areas: 
    'estimate current-price'
    'estimate final-estimate'
`

const MainTitle = styled.text`
  font-size: 32px;
`
const ValueContainer = styled.div`

`
const ValueName = styled.div`
  font-size: 24px;
`
const Value = styled.div`
  font-size: 24px;
`
const FinalEstimate = styled.div`
  font-size: 48px;
  text-align: center;
  grid-area: final-estimate;
`

export default class StockValuationResult extends React.Component<StockValuationParams> {
  public render() {
    return (
      <ResultSection>
          <ResultContainer gridArea='estimate'>
            <MainTitle>Estimates</MainTitle>
            <ValueContainer>
              <ValueName>Five years</ValueName>
              <Value>$999</Value>
            </ValueContainer>
            <ValueContainer>
              <ValueName>Today</ValueName>
              <Value>$999</Value>
            </ValueContainer>
          </ResultContainer>

          <ResultContainer gridArea='current-price'>
            <ValueContainer>
              <ValueName>Current price</ValueName>
              <Value>$999</Value>
            </ValueContainer>
          </ResultContainer>
          <ResultContainer gridArea='final-estimate'>
            <FinalEstimate>Overvalued</FinalEstimate>
          </ResultContainer>
      </ResultSection>
    );
  }
}
