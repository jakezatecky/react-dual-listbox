import React from 'react';
import { createRoot } from 'react-dom/client';

import AlignTopExample from './js/AlignTopExample';
import AllowDuplicatesExample from './js/AllowDuplicatesExample';
import BasicExample from './js/BasicExample';
import DisabledExample from './js/DisabledExample';
import FilterExample from './js/FilterExample';
import PreserveSelectOrderExample from './js/PreserveSelectOrderExample';
import OptGroupExample from './js/OptGroupExample';
import RequiredExample from './js/RequiredExample';
import RestrictAvailable from './js/RestrictAvailableExample';
import RtlExample from './js/RtlExample';

createRoot(document.getElementById('basic-example')).render(<BasicExample />);
createRoot(document.getElementById('optgroup-example')).render(<OptGroupExample />);
createRoot(document.getElementById('filter-example')).render(<FilterExample />);
createRoot(document.getElementById('align-top-example')).render(<AlignTopExample />);
createRoot(document.getElementById('disabled-example')).render(<DisabledExample />);
createRoot(document.getElementById('preserve-select-order-example')).render(<PreserveSelectOrderExample />);
createRoot(document.getElementById('allow-duplicates-example')).render(<AllowDuplicatesExample />);
createRoot(document.getElementById('required-example')).render(<RequiredExample />);
createRoot(document.getElementById('rtl-example')).render(<RtlExample />);
createRoot(document.getElementById('restrict-available-example')).render(<RestrictAvailable />);
