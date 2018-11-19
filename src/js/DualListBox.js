import classNames from 'classnames';
import escapeRegExp from 'lodash/escapeRegExp';
import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';

import Action from './Action';
import arrayFrom from './arrayFrom';
import ListBox from './ListBox';

const KEY_CODES = {
    SPACEBAR: 32,
    ENTER: 13,
};
const optionShape = PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
});
const valuePropType = PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.string,
        optionShape,
        PropTypes.shape({
            value: PropTypes.any,
            options: PropTypes.arrayOf(optionShape),
        }),
    ]),
);

const defaultFilter = (option, filterInput) => {
    if (filterInput === '') {
        return true;
    }

    return (new RegExp(escapeRegExp(filterInput), 'i')).test(option.label);
};

class DualListBox extends React.Component {
    static propTypes = {
        id: PropTypes.string,
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
        available: valuePropType,
        availableLabel: PropTypes.string,
        availableRef: PropTypes.func,
        canFilter: PropTypes.bool,
        disabled: PropTypes.bool,
        filter: PropTypes.shape({
            available: PropTypes.string.isRequired,
            selected: PropTypes.string.isRequired,
        }),
        filterCallback: PropTypes.func,
        filterPlaceholder: PropTypes.string,
        moveKeyCodes: PropTypes.arrayOf(PropTypes.number),
        name: PropTypes.string,
        preserveSelectOrder: PropTypes.bool,
        selected: valuePropType,
        selectedLabel: PropTypes.string,
        selectedRef: PropTypes.func,
        simpleValue: PropTypes.bool,
        onFilterChange: PropTypes.func,
    };

    static defaultProps = {
        alignActions: 'middle',
        available: undefined,
        availableLabel: 'Available',
        availableRef: null,
        canFilter: false,
        disabled: false,
        filter: null,
        filterPlaceholder: 'Search...',
        filterCallback: defaultFilter,
        moveKeyCodes: [KEY_CODES.SPACEBAR, KEY_CODES.ENTER],
        name: null,
        preserveSelectOrder: null,
        selected: [],
        selectedLabel: 'Selected',
        selectedRef: null,
        simpleValue: true,
        onFilterChange: null,
    };

    /**
     * @param {Object} props
     *
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            filter: props.filter ? props.filter : {
                available: '',
                selected: '',
            },
        };

        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);

        this.id = props.id || shortid.generate();
    }

    /**
     * @param {Object} filter
     *
     * @returns {void}
     */
    componentWillReceiveProps({ filter }) {
        if (filter !== null) {
            this.setState({ filter });
        }
    }

    /**
     * @param {Array} selected
     *
     * @returns {void}
     */
    onChange(selected) {
        const { options, simpleValue, onChange } = this.props;

        if (simpleValue) {
            onChange(selected);
        } else {
            const complexSelected = [];

            options.forEach((option) => {
                if (option.value) {
                    // Reconstruct selected single-level options
                    if (selected.indexOf(option.value) > -1) {
                        complexSelected.push(option);
                    }
                } else {
                    // Reconstruct optgroup options with those children selected
                    const subSelected = [];
                    option.options.forEach((subOption) => {
                        if (selected.indexOf(subOption.value) > -1) {
                            subSelected.push(subOption);
                        }
                    });

                    if (subSelected.length > 0) {
                        complexSelected.push({
                            label: option.label,
                            options: subSelected,
                        });
                    }
                }
            });

            onChange(complexSelected);
        }
    }

    /**
     * @param {string} direction
     * @param {boolean} isMoveAll
     *
     * @returns {void}
     */
    onClick({ direction, isMoveAll }) {
        const { options } = this.props;
        const select = direction === 'right' ? this.available : this.selected;

        let selected = [];

        if (isMoveAll) {
            selected = direction === 'right' ? this.makeOptionsSelected(options) : [];
        } else {
            selected = this.toggleSelected(
                this.getSelectedOptions(select),
            );
        }

        this.onChange(selected);
    }

    /**
     * @param {Object} event
     *
     * @returns {void}
     */
    onDoubleClick(event) {
        const { value } = event.currentTarget;
        const selected = this.toggleSelected([value]);

        this.onChange(selected);
    }

    /**
     * @param {Event} event
     *
     * @returns {void}
     */
    onKeyUp(event) {
        const { currentTarget, keyCode } = event;
        const { moveKeyCodes } = this.props;

        if (moveKeyCodes.indexOf(keyCode) > -1) {
            const selected = this.toggleSelected(
                arrayFrom(currentTarget.options)
                    .filter(option => option.selected)
                    .map(option => option.value),
            );

            this.onChange(selected);
        }
    }

    /**
     * @param {Event} event
     *
     * @returns {void}
     */
    onFilterChange(event) {
        const { onFilterChange } = this.props;
        const { filter } = this.state;

        const newFilter = {
            ...filter,
            [event.target.dataset.key]: event.target.value,
        };

        if (onFilterChange) {
            onFilterChange(newFilter);
        } else {
            this.setState({ filter: newFilter });
        }
    }

    /**
     * @param {Array} options
     *
     * @returns {Array}
     */
    getFlatOptions(options) {
        const { simpleValue } = this.props;

        if (simpleValue) {
            return options;
        }

        const flattened = [];
        options.forEach((option) => {
            if (option.value) {
                // Flatten single-level options
                flattened.push(option.value);
            } else {
                // Flatten optgroup options
                option.options.forEach((subOption) => {
                    flattened.push(subOption.value);
                });
            }
        });

        return flattened;
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
     * Make all the given options selected, appending them after the existing selections.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    makeOptionsSelected(options) {
        const { selected: previousSelected } = this.props;
        let newSelected = [];

        this.filterAvailable(options).forEach((option) => {
            if (option.options !== undefined) {
                newSelected = [...newSelected, ...this.makeOptionsSelected(option.options)];
            } else {
                newSelected.push(option.value);
            }
        });

        return [
            ...this.getFlatOptions(previousSelected),
            ...newSelected,
        ];
    }

    /**
     * Toggle a new set of selected elements.
     *
     * @param {Array} selectedItems
     *
     * @returns {Array}
     */
    toggleSelected(selectedItems) {
        const { selected } = this.props;
        const oldSelected = this.getFlatOptions(selected).slice(0);

        selectedItems.forEach((value) => {
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
        const { available, selected } = this.props;
        const { filter: { available: availableFilter } } = this.state;

        if (available !== undefined) {
            return this.filterOptions(
                options,
                option => (
                    this.getFlatOptions(available).indexOf(option.value) >= 0 &&
                    this.getFlatOptions(selected).indexOf(option.value) < 0
                ),
                availableFilter,
            );
        }

        // Show all un-selected options
        return this.filterOptions(
            options,
            option => this.getFlatOptions(selected).indexOf(option.value) < 0,
            availableFilter,
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
        const { preserveSelectOrder, selected } = this.props;
        const { filter: { selected: selectedFilter } } = this.state;

        if (preserveSelectOrder) {
            return this.filterSelectedByOrder(options);
        }

        // Order the selections by the default order
        return this.filterOptions(
            options,
            option => this.getFlatOptions(selected).indexOf(option.value) >= 0,
            selectedFilter,
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
        const { canFilter, filterCallback, selected } = this.props;
        const { filter: { selected: selectedFilter } } = this.state;
        const labelMap = this.getLabelMap(options);

        const selectedOptions = this.getFlatOptions(selected).map(value => ({
            value,
            label: labelMap[value],
        }));

        if (canFilter) {
            return selectedOptions.filter(
                selectedOption => filterCallback(selectedOption, selectedFilter),
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
                    <optgroup key={key} id={`${this.id}-optgroup-${option.label}`} label={option.label}>
                        {this.renderOptions(option.options)}
                    </optgroup>
                );
            }

            return (
                <option key={key} id={`${this.id}-option-${option.value}`} value={option.value}>
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
        const { filter } = this.state;

        return (
            <ListBox
                actions={alignActions === 'top' ? actions : null}
                canFilter={canFilter}
                controlKey={controlKey}
                disabled={disabled}
                displayName={displayName}
                filterPlaceholder={filterPlaceholder}
                filterValue={filter[controlKey]}
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
            availableLabel,
            availableRef,
            canFilter,
            disabled,
            name,
            options,
            selected,
            selectedLabel,
            selectedRef
        } = this.props;
        const availableOptions = this.renderOptions(this.filterAvailable(options));
        const selectedOptions = this.renderOptions(this.filterSelected(options));
        const actionsRight = (
            <div className="rdl-actions-right">
                <Action id={`${this.id}-moveall-right`} direction="right" disabled={disabled} isMoveAll onClick={this.onClick} />
                <Action id={`${this.id}-move-right`} direction="right" disabled={disabled} onClick={this.onClick} />
            </div>
        );
        const actionsLeft = (
            <div className="rdl-actions-left">
                <Action id={`${this.id}-moveall-left`} direction="left" disabled={disabled} onClick={this.onClick} />
                <Action id={`${this.id}-move-left`} direction="left" disabled={disabled} isMoveAll onClick={this.onClick} />
            </div>
        );

        const className = classNames({
            'react-dual-listbox': true,
            'rdl-has-filter': canFilter,
            'rdl-align-top': alignActions === 'top',
        });
        const value = this.getFlatOptions(selected).join(',');

        return (
            <div className={className}>
                {this.renderListBox('available', availableLabel, availableOptions, availableRef, actionsRight)}
                {alignActions === 'middle' ? (
                    <div className="rdl-actions">
                        {actionsRight}
                        {actionsLeft}
                    </div>
                ) : null}
                {this.renderListBox('selected', selectedLabel, selectedOptions, selectedRef, actionsLeft)}
                <input disabled={disabled} name={name} type="hidden" value={value} />
            </div>
        );
    }
}

export default DualListBox;
