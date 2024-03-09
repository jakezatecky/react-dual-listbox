import React from 'react';
import { createRoot } from 'react-dom/client';

import AlignTopExample from './js/AlignTopExample.jsx';
import AllowDuplicatesExample from './js/AllowDuplicatesExample.jsx';
import BasicExample from './js/BasicExample.jsx';
import DisabledExample from './js/DisabledExample.jsx';
import FilterExample from './js/FilterExample.jsx';
import LazyFilterExample from './js/LazyFilterExample.jsx';
import PreserveSelectOrderExample from './js/PreserveSelectOrderExample.jsx';
import OptGroupExample from './js/OptGroupExample.jsx';
import RequiredExample from './js/RequiredExample.jsx';
import RestrictAvailable from './js/RestrictAvailableExample.jsx';
import RtlExample from './js/RtlExample.jsx';

createRoot(document.getElementById('basic-example')).render(<BasicExample />);
createRoot(document.getElementById('optgroup-example')).render(<OptGroupExample />);
createRoot(document.getElementById('filter-example')).render(<FilterExample />);
createRoot(document.getElementById('lazy-filter-example')).render(<LazyFilterExample />);
createRoot(document.getElementById('align-top-example')).render(<AlignTopExample />);
createRoot(document.getElementById('disabled-example')).render(<DisabledExample />);
createRoot(document.getElementById('preserve-select-order-example')).render(<PreserveSelectOrderExample />);
createRoot(document.getElementById('allow-duplicates-example')).render(<AllowDuplicatesExample />);
createRoot(document.getElementById('required-example')).render(<RequiredExample />);
createRoot(document.getElementById('rtl-example')).render(<RtlExample />);
createRoot(document.getElementById('restrict-available-example')).render(<RestrictAvailable />);
