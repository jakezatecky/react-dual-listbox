import React from 'react';
import ReactDOM from 'react-dom';

import AlignTopExample from './js/AlignTopExample';
import BasicExample from './js/BasicExample';
import DisabledExample from './js/DisabledExample';
import FilterExample from './js/FilterExample';
import PreserveSelectOrderExample from './js/PreserveSelectOrderExample';
import OptGroupExample from './js/OptGroupExample';
import RestrictAvailable from './js/RestrictAvailableExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<OptGroupExample />, document.getElementById('optgroup-example'));
ReactDOM.render(<FilterExample />, document.getElementById('filter-example'));
ReactDOM.render(<AlignTopExample />, document.getElementById('align-top-example'));
ReactDOM.render(<DisabledExample />, document.getElementById('disabled-example'));
ReactDOM.render(<PreserveSelectOrderExample />, document.getElementById('preserve-select-order-example'));
ReactDOM.render(<RestrictAvailable />, document.getElementById('restrict-available-example'));
