import React from 'react';
import Header from './components/Header'

import ProductBox from './components/Product'

function App() {
  return (
    <div className="container">
        <Header title='Products App' />
        <br />
        <ProductBox />
    </div>
  );
}

export default App;
