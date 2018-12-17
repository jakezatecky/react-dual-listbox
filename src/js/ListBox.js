import PropTypes from 'prop-types';
import React from 'react';

import languageShape from './shapes/languageShape';
import arrayFrom from './util/arrayFrom';
import capitalizeFirstLetter from './util/capitalizeFirstLetter';

class ListBox extends React.Component {
    static propTypes = {
        canFilter: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        controlKey: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired,
        displayName: PropTypes.string.isRequired,
        filterPlaceholder: PropTypes.string.isRequired,
        filterValue: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        inputRef: PropTypes.func.isRequired,
        lang: languageShape.isRequired,
        showNoOptionsText: PropTypes.bool.isRequired,
        onDoubleClick: PropTypes.func.isRequired,
        onFilterChange: PropTypes.func.isRequired,
        onKeyUp: PropTypes.func.isRequired,

        actions: PropTypes.node,
    };

    static defaultProps = {
        actions: null,
    };

    /**
     * @returns {void}
     */
    constructor() {
        super();

        this.state = {
            value: [],
        };

        this.onChange = this.onChange.bind(this);
    }

    /**
     * @param {object} event
     *
     * @returns {void}
     */
    onChange(event) {
        const value = arrayFrom(event.target.options)
            .filter(option => option.selected)
            .map(option => option.value);

        this.setState({ value });
    }

    /**
     * @returns {React.Component}
     */
    renderFilter() {
        const {
            canFilter,
            controlKey,
            disabled,
            displayName,
            filterPlaceholder,
            filterValue,
            id,
            onFilterChange,
        } = this.props;

        if (!canFilter) {
            return null;
        }

        return (
            <div className="rdl-filter-container">
                <label className="rdl-control-label" htmlFor={`${id}-filter-${controlKey}`}>
                    Filter
                    {` ${displayName}`}
                </label>
                <input
                    className="rdl-filter"
                    data-key={controlKey}
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

    /**
     * @returns {React.Component}
     */
    renderSelect() {
        const {
            children,
            disabled,
            controlKey,
            displayName,
            id,
            inputRef,
            lang,
            showNoOptionsText,
            onDoubleClick,
            onKeyUp,
        } = this.props;
        const { value } = this.state;

        if (showNoOptionsText && React.Children.count(children) === 0) {
            return (
                <div className="rdl-no-options">
                    {lang[`no${capitalizeFirstLetter(controlKey)}Options`]}
                </div>
            );
        }

        return (
            <div className="rdl-control-container">
                <label className="rdl-control-label" htmlFor={`${id}-${controlKey}`}>
                    {displayName}
                </label>
                <select
                    className="rdl-control"
                    disabled={disabled}
                    id={`${id}-${controlKey}`}
                    multiple
                    ref={inputRef}
                    value={value}
                    onChange={this.onChange}
                    onDoubleClick={onDoubleClick}
                    onKeyUp={onKeyUp}
                >
                    {children}
                </select>
            </div>
        );
    }

    render() {
        const { actions, controlKey } = this.props;

        return (
            <div className={`rdl-listbox rdl-${controlKey}`}>
                {this.renderFilter()}
                {actions}
                {this.renderSelect()}
            </div>
        );
    }
}

export default ListBox;
