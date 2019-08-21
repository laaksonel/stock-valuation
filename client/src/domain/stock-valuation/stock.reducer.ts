import { getStockData } from "../../core/api/stockDataApi";
import { ThunkDispatch } from "redux-thunk";

export interface StockData {
  eps: number;
  fiveYearPE: number;
  expectedGrowth: number;
}

export type StockDataResponse = StockData & { currentPrice: number; };

// Actions
const UPDATE_SELECTED_STOCK_SUCCESS = 'stock/update-selected-stock';

interface UpdateSelectedStockSuccess {
  type: typeof UPDATE_SELECTED_STOCK_SUCCESS;
  payload: StockDataResponse;
}

export type IStockAction =
  | UpdateSelectedStockSuccess;

export interface IStockState {
  selectedStockData?: StockData;
  currentPrice?: number;
}

export default (state: IStockState = {}, action: IStockAction): IStockState => {
  switch(action.type) {
    case UPDATE_SELECTED_STOCK_SUCCESS:
      const { currentPrice, ...data } = action.payload;
      return {
        ...state,
        selectedStockData: data,
        currentPrice: currentPrice
      }
    default:
      return state;
  }
}

function updateStockDataSuccess(data: StockDataResponse): IStockAction {
  return {
    type: UPDATE_SELECTED_STOCK_SUCCESS,
    payload: data
  };
}

export type StockDispatch = ThunkDispatch<IStockState, void, IStockAction>;

export function fetchStockData(stockTicker: string) {
  return async (dispatch: StockDispatch) => {
    try {
      const data = await getStockData(stockTicker);
      dispatch(updateStockDataSuccess(data));
    } catch(err) {
      console.log(err);
    }
  }
}