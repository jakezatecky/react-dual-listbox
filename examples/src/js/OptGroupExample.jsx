import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { planetsAndMoons as options } from './options.js';

function OptGroupExample() {
    const [selected, setSelected] = useState(['luna', 'io']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            id="opt-group"
            options={options}
            selected={selected}
            onChange={onChange}
        />
    );
}

export default OptGroupExample;
