import React from 'react';
import Header from './core/layout/Header';
import MainContent from './core/layout/MainContent';
import TickerSearch from './domain/stock-search/TickerSearch';

const App: React.FC = () => {
  return (
    <div>
      <Header label='Stock valuator'>
        <TickerSearch />
      </Header>
      <MainContent />
    </div>
  );
}

export default App;
