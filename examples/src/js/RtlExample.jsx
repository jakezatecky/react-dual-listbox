import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { planetsAndMoons as options } from './options.js';

function RtlExample() {
    const [selected, setSelected] = useState(['phobos', 'europa', 'callisto']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            htmlDir="rtl"
            id="rtl"
            options={options}
            selected={selected}
            onChange={onChange}
        />
    );
}

export default RtlExample;
