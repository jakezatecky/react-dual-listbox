import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { moons as options } from './options';

function BasicExample() {
    const [selected, setSelected] = useState(['phobos', 'titan']);

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <DualListBox
            options={options}
            selected={selected}
            onChange={onChange}
        />
    );
}

export default BasicExample;
