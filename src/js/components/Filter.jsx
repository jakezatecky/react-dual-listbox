import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { LanguageContext } from '../contexts';

const propTypes = {
    controlKey: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    filterValue: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

function Filter(props) {
    const {
        controlKey,
        disabled,
        filterValue,
        id,
        onFilterChange,
    } = props;
    const {
        filterPlaceholder,
        [`${controlKey}FilterHeader`]: filterHeader,
    } = useContext(LanguageContext);

    return (
        <div className="rdl-filter-container">
            <label className="rdl-control-label rdl-sr-only" htmlFor={`${id}-filter-${controlKey}`}>
                {filterHeader}
            </label>
            <input
                className="rdl-filter"
                data-control-key={controlKey}
                disabled={disabled}
                id={`${id}-filter-${controlKey}`}
                placeholder={filterPlaceholder}
                type="text"
                value={filterValue}
                onChange={onFilterChange}
            />
        </div>
    );
}

Filter.propTypes = propTypes;

export default Filter;
