import * as React from 'react';
import StockValuationResult from './result/StockValuationResult';
import { StockData, StockDispatch, updateStockData } from './stock.reducer';
import { StockMultiplierKey, StockValuationMultipliers } from '../stockEntity';
import StockParameters from './parameters/StockParameters';
import { IAppState } from '../app.reducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

interface StockValuationProps extends StateProps, DispatchProps { }
interface StockValuationState {
  multipliers: StockValuationMultipliers;
}

class StockValuationPage extends React.Component<StockValuationProps, StockValuationState> {
  constructor(props: StockValuationProps) {
    super(props);
    this.state = {
      multipliers: {
        discount: 10,
        marginOfSafety: 10,
      },
    };
  }

  private onUpdateValuationData = (key: keyof StockData, value: number) => {
    if (this.props.currentStockData) {
      const valuationData: StockData = {
        ...this.props.currentStockData,
        [key]: value,
      };

      this.props.updateStockData(valuationData);
    }
  }

  private onMultipliersChange = (key: StockMultiplierKey, value: number) => {
    const multipliers: StockValuationMultipliers = {
      ...this.state.multipliers,
      [key]: value,
    };

    this.setState({
      ...this.state,
      multipliers,
    });
  }

  public render() {
    const {
      currentPrice,
      currentStockData,
    } = this.props;

    return currentStockData && (
      <React.Fragment>
        <StockParameters
          data={currentStockData}
          onMultiplierChange={this.onMultipliersChange}
          onUpdateValuationData={this.onUpdateValuationData}
          multipliers={this.state.multipliers}
        />

        <StockValuationResult
          valuationData={currentStockData}
          currentPrice={currentPrice}
          multipliers={this.state.multipliers}
        />
      </React.Fragment>
    ) || null;
  }
}

const mapDispatchToProps = (dispatch: StockDispatch) =>
  bindActionCreators({
    updateStockData,
  // tslint:disable-next-line: align
  }, dispatch);

const mapStateToProps = (state: IAppState) => state.stock;
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(StockValuationPage);
