import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { moons as options } from './options';

function RequiredExample() {
    const [selected, setSelected] = useState([]);

    const onSubmit = (event) => {
        // Don't reload page
        event.preventDefault();
    };

    const onChange = (value) => {
        setSelected(value);
    };

    return (
        <form onSubmit={onSubmit}>
            <DualListBox
                options={options}
                required
                selected={selected}
                showRequiredMessage
                onChange={onChange}
            />
            <input className="rdl-btn btn-submit" type="submit" value="Submit" />
        </form>
    );
}

export default RequiredExample;
