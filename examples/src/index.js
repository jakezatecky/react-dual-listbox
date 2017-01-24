import React from 'react';
import ReactDOM from 'react-dom';

import BasicExample from './js/BasicExample';
import OptGroupExample from './js/OptGroupExample';
import RestrictAvailable from './js/RestrictAvailableExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<OptGroupExample />, document.getElementById('optgroup-example'));
ReactDOM.render(<RestrictAvailable />, document.getElementById('restrict-available-example'));
