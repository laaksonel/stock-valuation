import { getStockData } from '../../core/api/stockDataApi';
import { ThunkDispatch } from 'redux-thunk';
import { calculateValuation, StockDataProps, StockValuation } from './valueCalculation';
import { StockValuationMultipliers } from '../stockEntity';

export interface StockData {
  eps: number | undefined;
  averageFiveYearPE: number | undefined;
  expectedGrowthRatePercent: number | undefined;
}

export type StockDataResponse = StockData & { currentPrice: number; };

// Actions
const FETCH_SELECTED_STOCK_SUCCESS = 'stock/fetch-selected-stock';
const UPDATE_STOCKDATA = 'stock/update-stock-data';
const UPDATE_VALUATION = 'stock/update-valuation';
const UPDATE_MULTIPLIERS = 'stock/update-multipliers';

interface FetchSelectedStockSuccess {
  type: typeof FETCH_SELECTED_STOCK_SUCCESS;
  payload: StockDataResponse;
}

interface UpdateStockData {
  type: typeof UPDATE_STOCKDATA;
  payload: {
    currentStockData: StockData;
    multipliers: StockValuationMultipliers;
  };
}

interface UpdateValuation {
  type: typeof UPDATE_VALUATION;
  payload: StockValuation;
}

interface UpdateMultipliers {
  type: typeof UPDATE_MULTIPLIERS;
  payload: StockValuationMultipliers;
}

export type IStockAction =
  | FetchSelectedStockSuccess
  | UpdateStockData
  | UpdateValuation
  | UpdateMultipliers;

export interface IStockState {
  currentStockData: StockData;
  currentPrice: number | undefined;
  currentValuation?: StockValuation;
  multipliers: StockValuationMultipliers;
}

const emptyStockData: StockData = {
  eps: undefined,
  averageFiveYearPE: undefined,
  expectedGrowthRatePercent: undefined,
};

const emptyState: IStockState = {
  currentStockData: emptyStockData,
  currentValuation: undefined,
  currentPrice: undefined,
  multipliers: {
    discount: 10,
    marginOfSafety: 10,
  },
};

export default (state: IStockState = emptyState, action: IStockAction): IStockState => {
  switch (action.type) {
    case FETCH_SELECTED_STOCK_SUCCESS:
      const { currentPrice, ...data } = action.payload;
      return {
        ...state,
        currentPrice,
        currentStockData: data,
      };
    case UPDATE_STOCKDATA:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_VALUATION:
      return {
        ...state,
        currentValuation: action.payload,
      };
    case UPDATE_MULTIPLIERS:
      return {
        ...state,
        multipliers: action.payload,
      };
    default:
      return state;
  }
};

function fetchStockDataSuccess(dataResponse: StockDataResponse) {
  const { currentPrice, ...data } = dataResponse;
  return (dispatch: StockDispatch) => {
    dispatch({
      type: FETCH_SELECTED_STOCK_SUCCESS,
      payload: dataResponse,
    });

    dispatch(updateValuation(emptyState.multipliers, data));
  };
}

export type StockDispatch = ThunkDispatch<IStockState, void, IStockAction>;

export function fetchStockData(stockTicker: string) {
  return async (dispatch: StockDispatch) => {
    try {
      const data = await getStockData(stockTicker);
      dispatch(fetchStockDataSuccess(data));
    } catch (err) {
      console.error(err);
    }
  };
}

export function updateStockData(multipliers: StockValuationMultipliers, data: StockData | undefined): IStockAction {
  return {
    type: UPDATE_STOCKDATA,
    payload: {
      multipliers,
      currentStockData: data || emptyStockData,
    },
  };
}

export function updateValuation(
  multipliers: StockValuationMultipliers,
  data: StockData | undefined,
) {
  return (dispatch: StockDispatch) => {
    dispatch(updateStockData(multipliers, data));

    dispatch({
      type: UPDATE_VALUATION,
      payload: calculateValuation(multipliers, data || emptyStockData)
    });
  };
}

export interface ValuationResult {
  currentPrice?: number;
  valueInFiveYears?: number;
  todayIntrinsicValue?: number;
}

export function getValuationResults(state: IStockState): ValuationResult {
  const {
    currentPrice,
    currentValuation,
  } = state;

  return {
    currentPrice,
    ...currentValuation,
  };
}
