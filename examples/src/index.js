import React from 'react';
import ReactDOM from 'react-dom';

import BasicExample from './BasicExample';
import OptGroupExample from './OptGroupExample';
import RestrictAvailable from './RestrictAvailableExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<OptGroupExample />, document.getElementById('optgroup-example'));
ReactDOM.render(<RestrictAvailable />, document.getElementById('restrict-available-example'));
