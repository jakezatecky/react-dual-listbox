import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { planetsAndMoons as options } from './options';

function DisabledExample() {
    const [selected, setSelected] = useState(['luna', 'io']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            canFilter
            disabled
            id="disabled"
            options={options}
            selected={selected}
            onChange={onChange}
        />
    );
}

export default DisabledExample;
