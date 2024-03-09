import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { planetsAndMoons as options } from './options.js';

function AlignTopExample() {
    const [selected, setSelected] = useState(['luna', 'io']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            alignActions="top"
            canFilter
            id="align-top"
            options={options}
            selected={selected}
            onChange={onChange}
        />
    );
}

export default AlignTopExample;
