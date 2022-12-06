import PropTypes from 'prop-types';
import React from 'react';

import languageShape from './shapes/languageShape';

class Filter extends React.PureComponent {
    static propTypes = {
        controlKey: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired,
        filterValue: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        lang: languageShape.isRequired,
        onFilterChange: PropTypes.func.isRequired,
    };

    render() {
        const {
            controlKey,
            disabled,
            filterValue,
            id,
            lang,
            onFilterChange,
        } = this.props;

        return (
            <div className="rdl-filter-container">
                <label className="rdl-control-label rdl-sr-only" htmlFor={`${id}-filter-${controlKey}`}>
                    {lang[`${controlKey}FilterHeader`]}
                </label>
                <input
                    className="rdl-filter"
                    data-control-key={controlKey}
                    disabled={disabled}
                    id={`${id}-filter-${controlKey}`}
                    placeholder={lang.filterPlaceholder}
                    type="text"
                    value={filterValue}
                    onChange={onFilterChange}
                />
            </div>
        );
    }
}

export default Filter;
