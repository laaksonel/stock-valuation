import { getStockData } from "../../core/api/stockDataApi";
import { ThunkDispatch } from "redux-thunk";

export interface StockData {
  eps: number;
  fiveYearPE: number;
  expectedGrowth: number;
}

// Actions
const UPDATE_SELECTED_STOCK_SUCCESS = 'stock/update-selected-stock';

interface UpdateSelectedStockSuccess {
  type: typeof UPDATE_SELECTED_STOCK_SUCCESS;
  payload: StockData;
}

export type IStockAction =
  | UpdateSelectedStockSuccess;

// State
export interface IStockState {
  selectedStockData?: StockData;
}

const dummyStock = {
  selectedStockData: {
    eps: 123,
    fiveYearPE: 456,
    expectedGrowth: 789,
  }
}

export default (state: IStockState = dummyStock, action: IStockAction): IStockState => {
  switch(action.type) {
    case UPDATE_SELECTED_STOCK_SUCCESS:
      return {
        ...state,
        selectedStockData: action.payload
      }
    default:
      return state;
  }
}

function updateStockDataSuccess(data: StockData): IStockAction {
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