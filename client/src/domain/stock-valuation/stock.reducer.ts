import { getStockData } from '../../core/api/stockDataApi';
import { ThunkDispatch } from 'redux-thunk';

export interface StockData {
  eps: number;
  averageFiveYearPE: number;
  expectedGrowthRatePercent: number;
}

export type StockDataResponse = StockData & { currentPrice: number; };

// Actions
const FETCH_SELECTED_STOCK_SUCCESS = 'stock/fetch-selected-stock';
const UPDATE_STOCKDATA = 'stock/update-stock-data';

interface FetchSelectedStockSuccess {
  type: typeof FETCH_SELECTED_STOCK_SUCCESS;
  payload: StockDataResponse;
}

interface UpdateStockData {
  type: typeof UPDATE_STOCKDATA;
  payload: StockData;
}

export type IStockAction =
  | FetchSelectedStockSuccess
  | UpdateStockData;

export interface IStockState {
  currentStockData?: StockData;
  currentPrice?: number;
}

export default (state: IStockState = {}, action: IStockAction): IStockState => {
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
        currentStockData: action.payload,
      };
    default:
      return state;
  }
};

function fetchStockDataSuccess(data: StockDataResponse): IStockAction {
  return {
    type: FETCH_SELECTED_STOCK_SUCCESS,
    payload: data,
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

export function updateStockData(data: StockData): IStockAction {
  return {
    type: UPDATE_STOCKDATA,
    payload: data,
  };
}
