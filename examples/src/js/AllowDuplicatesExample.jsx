import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { planetsAndMoons as options } from './options.js';

function AllowDuplicatesExample() {
    const [selected, setSelected] = useState(['luna', 'io']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            allowDuplicates
            id="allow-duplicates"
            options={options}
            preserveSelectOrder
            selected={selected}
            onChange={onChange}
        />
    );
}

export default AllowDuplicatesExample;
