import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { planetsAndMoons as options } from './options.js';

function PreserveSelectOrderExample() {
    const [selected, setSelected] = useState(['io', 'luna', 'europa']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            id="preserve-order"
            options={options}
            preserveSelectOrder
            selected={selected}
            showOrderButtons
            onChange={onChange}
        />
    );
}

export default PreserveSelectOrderExample;
