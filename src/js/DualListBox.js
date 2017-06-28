import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';

import Action from './Action';
import arrayFrom from './arrayFrom';
import ListBox from './ListBox';

const optionShape = PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
});

const defaultFilter = (option, filterInput) => {
    if (filterInput === '') {
        return true;
    }

    return (new RegExp(filterInput, 'i')).test(option.label);
};

class DualListBox extends React.Component {
    static propTypes = {
        options: PropTypes.arrayOf(
            PropTypes.oneOfType([
                optionShape,
                PropTypes.shape({
                    value: PropTypes.any,
                    options: PropTypes.arrayOf(optionShape),
                }),
            ]),
        ).isRequired,
        onChange: PropTypes.func.isRequired,

        alignActions: PropTypes.string,
        available: PropTypes.arrayOf(PropTypes.string),
        availableRef: PropTypes.func,
        canFilter: PropTypes.bool,
        disabled: PropTypes.bool,
        filterCallback: PropTypes.func,
        filterPlaceholder: PropTypes.string,
        name: PropTypes.string,
        preserveSelectOrder: PropTypes.bool,
        selected: PropTypes.arrayOf(PropTypes.string),
        selectedRef: PropTypes.func,
    };

    static defaultProps = {
        alignActions: 'middle',
        available: undefined,
        availableRef: null,
        canFilter: false,
        disabled: false,
        filterPlaceholder: 'Search...',
        filterCallback: defaultFilter,
        name: null,
        preserveSelectOrder: null,
        selected: [],
        selectedRef: null,
    };

    /**
     * @param {Object} props
     *
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                available: '',
                selected: '',
            },
        };

        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);

        this.id = shortid.generate();
    }

    /**
     * @param {string} direction
     * @param {boolean} isMoveAll
     *
     * @return {void}
     */
    onClick({ direction, isMoveAll }) {
        const { options, onChange } = this.props;
        const select = direction === 'right' ? this.available : this.selected;

        let selected = [];

        if (isMoveAll) {
            selected = direction === 'right' ? this.makeOptionsSelected(options) : [];
        } else {
            selected = this.toggleSelected(
                this.getSelectedOptions(select),
            );
        }

        onChange(selected);
    }

    /**
     * @param {Object} event
     *
     * @returns {void}
     */
    onDoubleClick(event) {
        const value = event.currentTarget.value;
        const selected = this.toggleSelected([value]);

        this.props.onChange(selected);
    }

    /**
     * @param {Event} event
     *
     * @returns {void}
     */
    onKeyUp(event) {
        const { currentTarget, key } = event;

        if (key === 'Enter') {
            const selected = this.toggleSelected(
                arrayFrom(currentTarget.options)
                    .filter(option => option.selected)
                    .map(option => option.value),
            );

            this.props.onChange(selected);
        }
    }

    /**
     * @param {Event} event
     *
     * @returns {void}
     */
    onFilterChange(event) {
        this.setState({
            filter: {
                ...this.state.filter,
                [event.target.dataset.key]: event.target.value,
            },
        });
    }

    /**
     * Converts a flat array to a key/value mapping.
     *
     * @param {Array} options
     *
     * @returns {Object}
     */
    getLabelMap(options) {
        let labelMap = {};

        options.forEach((option) => {
            if (option.options !== undefined) {
                labelMap = { ...labelMap, ...this.getLabelMap(option.options) };
            } else {
                labelMap[option.value] = option.label;
            }
        });

        return labelMap;
    }

    /**
     * Returns the selected options from a given element.
     *
     * @param {Object} element
     *
     * @returns {Array}
     */
    getSelectedOptions(element) {
        return arrayFrom(element.options)
            .filter(option => option.selected)
            .map(option => option.value);
    }

    /**
     * Make all the given options selected.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    makeOptionsSelected(options) {
        let selected = [];

        this.filterAvailable(options).forEach((option) => {
            if (option.options !== undefined) {
                selected = [...selected, ...this.makeOptionsSelected(option.options)];
            } else {
                selected.push(option.value);
            }
        });

        return [...this.props.selected, ...selected];
    }

    /**
     * Toggle a new set of selected elements.
     *
     * @param {Array} selected
     *
     * @returns {Array}
     */
    toggleSelected(selected) {
        const oldSelected = this.props.selected.slice(0);

        selected.forEach((value) => {
            const index = oldSelected.indexOf(value);

            if (index >= 0) {
                oldSelected.splice(index, 1);
            } else {
                oldSelected.push(value);
            }
        });

        return oldSelected;
    }

    /**
     * Filter options by a filtering function.
     *
     * @param {Array} options
     * @param {Function} filterer
     * @param {string} filterInput
     *
     * @returns {Array}
     */
    filterOptions(options, filterer, filterInput) {
        const { canFilter, filterCallback } = this.props;
        const filtered = [];

        options.forEach((option) => {
            if (option.options !== undefined) {
                const children = this.filterOptions(option.options, filterer, filterInput);

                if (children.length > 0) {
                    filtered.push({
                        label: option.label,
                        options: children,
                    });
                }
            } else if (filterer(option)) {
                // Test option against filter input
                if (canFilter && !filterCallback(option, filterInput)) {
                    return;
                }

                filtered.push(option);
            }
        });

        return filtered;
    }

    /**
     * Filter the available options.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    filterAvailable(options) {
        if (this.props.available !== undefined) {
            return this.filterOptions(
                options,
                option => (
                    this.props.available.indexOf(option.value) >= 0 &&
                    this.props.selected.indexOf(option.value) < 0
                ),
                this.state.filter.available,
            );
        }

        // Show all un-selected options
        return this.filterOptions(
            options,
            option => this.props.selected.indexOf(option.value) < 0,
            this.state.filter.available,
        );
    }

    /**
     * Filter the selected options.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    filterSelected(options) {
        if (this.props.preserveSelectOrder) {
            return this.filterSelectedByOrder(options);
        }

        // Order the selections by the default order
        return this.filterOptions(
            options,
            option => this.props.selected.indexOf(option.value) >= 0,
            this.state.filter.selected,
        );
    }

    /**
     * Preserve the selection order. This drops the opt-group associations.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    filterSelectedByOrder(options) {
        const { canFilter, filterCallback } = this.props;
        const labelMap = this.getLabelMap(options);

        const selectedOptions = this.props.selected.map(selected => ({
            value: selected,
            label: labelMap[selected],
        }));

        if (canFilter) {
            return selectedOptions.filter(
                selected => filterCallback(selected, this.state.filter.selected),
            );
        }

        return selectedOptions;
    }

    /**
     * @returns {Array}
     */
    renderOptions(options) {
        return options.map((option) => {
            const key = `${option.value}-${option.label}`;

            if (option.options !== undefined) {
                return (
                    <optgroup key={key} label={option.label}>
                        {this.renderOptions(option.options)}
                    </optgroup>
                );
            }

            return (
                <option key={key} value={option.value}>
                    {option.label}
                </option>
            );
        });
    }

    /**
     * @param {string} controlKey
     * @param {string} displayName
     * @param {Array} options
     * @param {function} ref
     * @param {React.Component} actions
     *
     * @returns {React.Component}
     */
    renderListBox(controlKey, displayName, options, ref, actions) {
        const {
            alignActions,
            canFilter,
            disabled,
            filterPlaceholder,
        } = this.props;

        return (
            <ListBox
                actions={alignActions === 'top' ? actions : null}
                canFilter={canFilter}
                controlKey={controlKey}
                disabled={disabled}
                displayName={displayName}
                filterPlaceholder={filterPlaceholder}
                filterValue={this.state.filter[controlKey]}
                id={this.id}
                inputRef={(c) => {
                    this[controlKey] = c;

                    if (ref) {
                        ref(c);
                    }
                }}
                onDoubleClick={this.onDoubleClick}
                onFilterChange={this.onFilterChange}
                onKeyUp={this.onKeyUp}
            >
                {options}
            </ListBox>
        );
    }

    /**
     * @returns {React.Component}
     */
    render() {
        const {
            alignActions,
            canFilter,
            disabled,
            name,
            options,
            selected,
            availableRef,
            selectedRef,
        } = this.props;
        const availableOptions = this.renderOptions(this.filterAvailable(options));
        const selectedOptions = this.renderOptions(this.filterSelected(options));
        const actionsRight = (
            <div className="rdl-actions-right">
                <Action disabled={disabled} direction="right" isMoveAll onClick={this.onClick} />
                <Action disabled={disabled} direction="right" onClick={this.onClick} />
            </div>
        );
        const actionsLeft = (
            <div className="rdl-actions-left">
                <Action disabled={disabled} direction="left" onClick={this.onClick} />
                <Action disabled={disabled} direction="left" isMoveAll onClick={this.onClick} />
            </div>
        );

        const className = classNames({
            'react-dual-listbox': true,
            'rdl-has-filter': canFilter,
            'rdl-align-top': alignActions === 'top',
        });

        return (
            <div className={className}>
                {this.renderListBox('available', 'Available', availableOptions, availableRef, actionsRight)}
                {alignActions === 'middle' ? (
                    <div className="rdl-actions">
                        {actionsRight}
                        {actionsLeft}
                    </div>
                ) : null}
                {this.renderListBox('selected', 'Selected', selectedOptions, selectedRef, actionsLeft)}
                <input disabled={disabled} name={name} value={selected} type="hidden" />
            </div>
        );
    }
}

export default DualListBox;
