import { uniqBy } from 'lodash';
import React, { useCallback, useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { moons } from './options';

function mockApiRequest(filterText) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (filterText === '') {
                resolve([]);
            } else {
                // Return options that contain the search string
                resolve(
                    moons.filter(({ value }) => value.includes(filterText)),
                );
            }
        }, 500);
    });
}

function LazyFilterExample() {
    // We need to control the filter state when doing lazy filters
    const [filter, setFilter] = useState({ available: '', selected: '' });

    // The initial options must have data for any selected values
    const [options, setOptions] = useState([
        { value: 'luna', label: 'Moon' },
    ]);

    // In this case, luna is our single initial selected value
    const [selected, setSelected] = useState(['luna']);

    // Standard onChange function
    const onChange = useCallback((value) => {
        setSelected(value);
    }, []);

    const onFilterChange = useCallback((newFilter) => {
        // We must update the filter state when using `onFilterChange`
        setFilter(newFilter);

        mockApiRequest(newFilter.available).then((newOptions) => {
            // Append the new options to the existing options
            // `uniqBy` will discard any duplicates
            setOptions(
                uniqBy([
                    ...options,
                    ...newOptions,
                ], 'value'),
            );
        });
    }, [options]);

    return (
        <DualListBox
            canFilter
            filter={filter}
            id="lazy-filter"
            lang={{
                availableFilterPlaceholder: 'Search for new options...',
                selectedFilterPlaceholder: 'Filter selected...',
            }}
            options={options}
            selected={selected}
            onChange={onChange}
            onFilterChange={onFilterChange}
        />
    );
}

export default LazyFilterExample;
