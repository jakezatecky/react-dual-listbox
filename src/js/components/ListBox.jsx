import PropTypes from 'prop-types';
import React, { Children, useContext } from 'react';

import { LanguageContext } from '../contexts';
import capitalizeFirstLetter from '../util/capitalizeFirstLetter';
import Filter from './Filter';

const propTypes = {
    canFilter: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    controlKey: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    filterValue: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,
    selections: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
    showNoOptionsText: PropTypes.bool.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,

    actions: PropTypes.node,
    id: PropTypes.string,
};
const defaultProps = {
    actions: null,
    id: null,
};

function ListBox(props) {
    const { controlKey, id } = props;
    const {
        [`${controlKey}Header`]: header,
        [`no${capitalizeFirstLetter(controlKey)}Options`]: noOptionsText,
    } = useContext(LanguageContext);
    const inputId = id ? `${id}-${controlKey}` : null;

    function renderFilter() {
        const {
            canFilter,
            disabled,
            filterValue,
            onFilterChange,
        } = props;

        if (!canFilter) {
            return null;
        }

        return (
            <Filter
                controlKey={controlKey}
                disabled={disabled}
                filterValue={filterValue}
                onFilterChange={onFilterChange}
            />
        );
    }

    function renderSelect() {
        const {
            actions,
            children,
            disabled,
            inputRef,
            selections,
            showNoOptionsText,
            onDoubleClick,
            onKeyUp,
            onSelectionChange,
        } = props;

        if (showNoOptionsText && Children.count(children) === 0) {
            return (
                <div className="rdl-no-options">
                    {noOptionsText}
                </div>
            );
        }

        return (
            <div className="rdl-control-container">
                {actions}
                <select
                    className="rdl-control"
                    disabled={disabled}
                    id={`${inputId}`}
                    multiple
                    ref={inputRef}
                    value={selections}
                    onChange={onSelectionChange}
                    onDoubleClick={onDoubleClick}
                    onKeyUp={onKeyUp}
                >
                    {children}
                </select>
            </div>
        );
    }

    return (
        <div className={`rdl-list-box rdl-${controlKey}`}>
            <label className="rdl-control-label" htmlFor={inputId}>
                {header}
            </label>
            {renderFilter()}
            {renderSelect()}
        </div>
    );
}

ListBox.propTypes = propTypes;
ListBox.defaultProps = defaultProps;

export default ListBox;
