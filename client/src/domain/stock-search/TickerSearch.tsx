import React, { FormEvent } from 'react';
import Autosuggest, { ChangeEvent } from 'react-autosuggest';
import { StockSuggestion } from './search';
import { clearSuggestions, updateSearch, fetchStockSuggestions, SearchDispatch } from './search.reducer';
import { connect } from 'react-redux';
import { IAppState } from '../app.reducer';
import { bindActionCreators } from 'redux';
import { SuggestionDiv, SuggestionSymbol, SuggestionInfo, SearchBoxDiv, searchBarTheme } from './styles';
import { FaSearch } from 'react-icons/fa';
import { StockDispatch, fetchStockData } from '../stock-valuation/stock.reducer';

const renderSuggestion = (s: StockSuggestion) => (
  <SuggestionDiv>
    <SuggestionSymbol>{s.symbol}</SuggestionSymbol>
    <SuggestionInfo>{s.shortName}</SuggestionInfo>
  </SuggestionDiv>
);

const getSuggestionValue = (s: StockSuggestion) => s.shortName;

interface ITickerSearch extends StateProps, DispatchProps { }

class TickerSearch extends React.PureComponent<ITickerSearch> {
  private onSuggestionSelected = (
    _: React.FormEvent,
    data: Autosuggest.SuggestionSelectedEventData<StockSuggestion>,
  ) => {
    this.props.fetchStockData(data.suggestion.symbol);
  }

  public render() {
    return (
      <SearchBoxDiv>
        <FaSearch />
        <Autosuggest
          theme={searchBarTheme}
          suggestions={this.props.suggestions}
          getSuggestionValue={getSuggestionValue}
          inputProps={{
            onChange: (_: FormEvent, params?: ChangeEvent | undefined) => {
              const searchValue = params && params.newValue;
              this.props.updateSearch(searchValue || '');
            },
            value: this.props.currentSearch,
          }}
          onSuggestionsFetchRequested={(currentInput) => {
            const searchValue = currentInput.value;
            if (searchValue !== '' && searchValue !== this.props.currentSearch) {
              this.props.fetchStockSuggestions(searchValue);
            }
          }}
          onSuggestionsClearRequested={this.props.clearSuggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestion={renderSuggestion}
        />
      </SearchBoxDiv>
    );
  }
}



const mapStateToProps = (state: IAppState) => state.search;
const mapDispatchToProps = (dispatch: SearchDispatch | StockDispatch) =>
  bindActionCreators({
    updateSearch,
    clearSuggestions,
    fetchStockSuggestions,
    fetchStockData,
  },                 dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(TickerSearch);
