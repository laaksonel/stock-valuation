import React, { FormEvent } from 'react';
import Autosuggest, { ChangeEvent } from 'react-autosuggest';
import { StockSuggestion } from './search';
import { clearSuggestions, updateSearch, fetchStockSuggestions, SearchDispatch } from './search.reducer';
import { connect } from 'react-redux';
import { IAppState } from '../app.reducer';
import { bindActionCreators } from 'redux';

const renderSuggestion = (s: StockSuggestion) => (
  <div>
    <div>{s.symbol}</div>
    <div>{s.shortName}</div>
  </div>
);

const getSuggestionValue = (s: StockSuggestion) => s.shortName;

interface ITickerSearch extends StateProps, DispatchProps { };

class TickerSearch extends React.PureComponent<ITickerSearch> {
  public render() {
    return (
      <div>
        <Autosuggest 
          suggestions={this.props.suggestions}
          getSuggestionValue={getSuggestionValue}
          inputProps={{
            onChange: (_: FormEvent, params?: ChangeEvent | undefined) => {
              const searchValue = params && params.newValue;
              searchValue !== this.props.currentSearch && this.props.updateSearch(searchValue || '')
            },
            value: this.props.currentSearch
          }}
          onSuggestionsFetchRequested={(currentInput) => this.props.fetchStockSuggestions(currentInput.value)}
          onSuggestionsClearRequested={this.props.clearSuggestions}
          renderSuggestion={renderSuggestion}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => state.search;
const mapDispatchToProps = (dispatch: SearchDispatch) => 
  bindActionCreators({
    updateSearch,
    clearSuggestions,
    fetchStockSuggestions,
  }, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(TickerSearch);
