import * as React from 'react';
import StockValuationResult from './result/StockValuationResult';
import { StockData, StockDispatch, updateStockData, updateValuation, OptionalNumber } from './stock.reducer';
import { StockMultiplierKey, StockValuationMultipliers } from '../entity/stock.entity';
import StockParameters from './parameters/StockParameters';
import { IAppState } from '../app.reducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { device } from '../../core/theme/main.theme';

class StockValuationPage extends React.Component<StateProps & DispatchProps> {
  private onUpdateValuationData = (key: keyof StockData, value: OptionalNumber) => {
    if (this.props.currentStockData) {
      const valuationData: StockData = {
        ...this.props.currentStockData,
        [key]: value,
      };

      this.props.updateValuation(this.props.multipliers, valuationData);
    }
  }

  private onMultipliersChange = (key: StockMultiplierKey, value: number) => {
    const multipliers: StockValuationMultipliers = {
      ...this.props.multipliers,
      [key]: value,
    };

    this.props.updateValuation(
      multipliers,
      this.props.currentStockData,
    );
  }

  public render() {
    const {
      currentStockData,
      multipliers,
    } = this.props;

    return (
      <PageContainer>
        <StockParameters
          data={currentStockData}
          onMultiplierChange={this.onMultipliersChange}
          onUpdateValuationData={this.onUpdateValuationData}
          multipliers={multipliers}
        />

        <StockValuationResult />
      </PageContainer>
    );
  }
}

const PageContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 5%;

  @media ${device.tablet} {
    width: 85%;
    padding: 3%;
  }

  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const mapDispatchToProps = (dispatch: StockDispatch) =>
  bindActionCreators({
    updateStockData,
    updateValuation,
  }, dispatch);

const mapStateToProps = (state: IAppState) => state.stock;
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(StockValuationPage);
