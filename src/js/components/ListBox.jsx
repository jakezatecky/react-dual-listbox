import classNames from 'classnames';
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
    id: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,
    selections: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
    showHeaderLabels: PropTypes.bool.isRequired,
    showNoOptionsText: PropTypes.bool.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,

    actions: PropTypes.node,
};
const defaultProps = {
    actions: null,
};

function ListBox(props) {
    const {
        controlKey,
        id,
        showHeaderLabels,
    } = props;
    const {
        [`${controlKey}Header`]: header,
        [`no${capitalizeFirstLetter(controlKey)}Options`]: noOptionsText,
    } = useContext(LanguageContext);

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
                id={id}
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
                    id={`${id}-${controlKey}`}
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

    const labelClassName = classNames({
        'rdl-control-label': true,
        'rdl-sr-only': !showHeaderLabels,
    });

    return (
        <div className={`rdl-list-box rdl-${controlKey}`}>
            <label className={labelClassName} htmlFor={`${id}-${controlKey}`}>
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
