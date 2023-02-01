import classNames from 'classnames';
import escapeRegExp from 'lodash/escapeRegExp';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React from 'react';

import Action from './Action';
import ListBox from './ListBox';
import defaultLang from './lang/default';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import optionsShape from './shapes/optionsShape';
import valueShape from './shapes/valueShape';
import indexesOf from './util/indexesOf';
import swapOptions from './util/swapOptions';
import { ALIGNMENTS, KEYS } from './constants';

const noop = () => {};
const defaultFilter = (option, filterInput) => {
    if (filterInput === '') {
        return true;
    }

    return (new RegExp(escapeRegExp(filterInput), 'i')).test(option.label);
};
const defaultIcons = {
    moveLeft: <span className="rdl-icon rdl-icon-move-left" />,
    moveAllLeft: <span className="rdl-icon rdl-icon-move-all-left" />,
    moveRight: <span className="rdl-icon rdl-icon-move-right" />,
    moveAllRight: <span className="rdl-icon rdl-icon-move-all-right" />,
    moveBottom: <span className="rdl-icon rdl-icon-move-bottom" />,
    moveDown: <span className="rdl-icon rdl-icon-move-down" />,
    moveUp: <span className="rdl-icon rdl-icon-move-up" />,
    moveTop: <span className="rdl-icon rdl-icon-move-top" />,
};

class DualListBox extends React.Component {
    static propTypes = {
        options: optionsShape.isRequired,
        onChange: PropTypes.func.isRequired,

        alignActions: PropTypes.oneOf([ALIGNMENTS.MIDDLE, ALIGNMENTS.TOP]),
        allowDuplicates: PropTypes.bool,
        available: valueShape,
        availableRef: PropTypes.func,
        canFilter: PropTypes.bool,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        filter: PropTypes.shape({
            available: PropTypes.string.isRequired,
            selected: PropTypes.string.isRequired,
        }),
        filterCallback: PropTypes.func,
        htmlDir: PropTypes.string,
        icons: iconsShape,
        iconsClass: PropTypes.string,
        id: PropTypes.string,
        lang: languageShape,
        moveKeys: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        preserveSelectOrder: PropTypes.bool,
        required: PropTypes.bool,
        selected: valueShape,
        selectedRef: PropTypes.func,
        showHeaderLabels: PropTypes.bool,
        showNoOptionsText: PropTypes.bool,
        showOrderButtons: PropTypes.bool,
        simpleValue: PropTypes.bool,
        onFilterChange: PropTypes.func,
    };

    static defaultProps = {
        alignActions: ALIGNMENTS.MIDDLE,
        allowDuplicates: false,
        available: undefined,
        availableRef: null,
        canFilter: false,
        className: null,
        disabled: false,
        filter: null,
        filterCallback: defaultFilter,
        htmlDir: 'ltr',
        icons: defaultIcons,
        iconsClass: 'fa5',
        id: null,
        lang: defaultLang,
        moveKeys: [KEYS.SPACEBAR, KEYS.ENTER],
        name: null,
        preserveSelectOrder: null,
        required: false,
        selected: [],
        selectedRef: null,
        simpleValue: true,
        showHeaderLabels: false,
        showNoOptionsText: false,
        showOrderButtons: false,
        onFilterChange: null,
    };

    /**
     * Flatten an array of options to a simple list of values.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    static flattenOptions(options) {
        const flattened = [];

        options.forEach((option) => {
            if (option.value !== undefined) {
                // Flatten single-level options
                flattened.push(option.value);
            } else if (option.options !== undefined) {
                // Flatten optgroup options
                option.options.forEach((subOption) => {
                    flattened.push(subOption.value);
                });
            }
        });

        return flattened;
    }

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
            id: props.id || `rdl-${nanoid()}`,
            selected: [],
            selections: {
                available: [],
                selected: [],
            },
        };

        this.onActionClick = this.onActionClick.bind(this);
        this.onOptionDoubleClick = this.onOptionDoubleClick.bind(this);
        this.onOptionKeyUp = this.onOptionKeyUp.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onHiddenFocus = this.onHiddenFocus.bind(this);
    }

    /**
     * @param {Object} props
     * @param {Object} prevState
     *
     * @returns {Object}
     */
    static getDerivedStateFromProps(
        {
            filter,
            id,
            selected,
            simpleValue,
        },
        prevState,
    ) {
        const newSelected = simpleValue ? selected : DualListBox.flattenOptions(selected);
        const newState = { ...prevState, selected: newSelected };

        // Allow user to control filter, if so desired
        if (filter !== null) {
            newState.filter = filter;
        }

        // Allow user to control ID, if so desired
        if (id !== null) {
            newState.id = id;
        }

        return newState;
    }

    /**
     * @returns {void}
     */
    componentDidMount() {
        this.setValidityMessage();
    }

    /**
     * @returns {void}
     */
    componentDidUpdate() {
        this.setValidityMessage();
    }

    /**
     * @param {Array} selected The new selected values
     * @param {Array} selection The options the user highlighted (if any)
     * @param {string} controlKey The key for the control that fired this event.
     * @param {boolean} isRearrange Whether the change is a result of re-arrangement.
     *
     * @returns {void}
     */
    onChange(selected, selection, controlKey, isRearrange = false) {
        const { options, simpleValue, onChange } = this.props;
        const { selections } = this.state;
        const userSelection = selection.map(({ value }) => value);

        if (simpleValue) {
            onChange(selected, userSelection, controlKey);
        } else {
            const complexValues = { selected: [], userSelection: [] };
            const sourceValues = { selected, userSelection };

            // Reconstruct option objects for both the selected values and user selection
            Object.keys(sourceValues).forEach((key) => {
                // Reconstruct hierarchy from single-level options
                // Note that complex values become expensive if there are several options
                sourceValues[key].forEach((value) => {
                    options.forEach((option) => {
                        if (option.value) {
                            if (option.value === value) {
                                complexValues[key].push(option);
                            }
                        } else {
                            // Reconstruct optgroup options with those children
                            const subSelected = [];
                            option.options.forEach((subOption) => {
                                if (subOption.value === value) {
                                    subSelected.push(subOption);
                                }
                            });

                            if (subSelected.length > 0) {
                                complexValues[key].push({
                                    label: option.label,
                                    options: subSelected,
                                });
                            }
                        }
                    });
                });
            });

            onChange(complexValues.selected, complexValues.userSelection, controlKey);
        }

        // Reset selections after moving items for cleaner experience and to remove invalid values
        // Note that this should not occur for re-arrangement operations
        if (!isRearrange) {
            this.setState({
                selections: {
                    ...selections,
                    [controlKey]: [],
                },
            });
        }
    }

    /**
     * @param {string} direction
     * @param {boolean} isMoveAll
     *
     * @returns {void}
     */
    onActionClick({ direction, isMoveAll }) {
        const { options } = this.props;
        const directionIsRight = direction === 'right';
        const sourceListBox = directionIsRight ? this.available : this.selected;
        const marked = this.getMarkedOptions(sourceListBox);
        let isRearrangement = false;

        let selected;

        if (['up', 'down'].indexOf(direction) > -1) {
            selected = this.rearrangeSelected(marked, direction);
            isRearrangement = true;
        } else if (['top', 'bottom'].indexOf(direction) > -1) {
            selected = this.rearrangeToExtremes(marked, direction);
            isRearrangement = true;
        } else if (isMoveAll) {
            selected = directionIsRight ?
                this.makeOptionsSelected(options) :
                this.makeOptionsUnselected(options);
        } else {
            selected = this.toggleHighlighted(
                marked,
                directionIsRight ? 'available' : 'selected',
            );
        }

        this.onChange(selected, marked, directionIsRight ? 'available' : 'selected', isRearrangement);
    }

    /**
     * @param {Object} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    onOptionDoubleClick(event, controlKey) {
        const marked = this.getMarkedOptions(event.currentTarget);
        const selected = this.toggleHighlighted(marked, controlKey);

        this.onChange(selected, marked, controlKey);
    }

    /**
     * @param {Event} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    onOptionKeyUp(event, controlKey) {
        const { currentTarget, key } = event;
        const { moveKeys } = this.props;

        if (moveKeys.indexOf(key) > -1) {
            const marked = this.getMarkedOptions(currentTarget);
            const selected = this.toggleHighlighted(marked, controlKey);

            this.onChange(selected, marked, controlKey);
        }
    }

    /**
     * @param {Object} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    onSelectionChange(event, controlKey) {
        const { selections } = this.state;

        const value = Array.from(event.target.options)
            .filter((option) => option.selected)
            .map((option) => option.value);

        this.setState({
            selections: {
                ...selections,
                [controlKey]: value,
            },
        });
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
            [event.target.dataset.controlKey]: event.target.value,
        };

        if (onFilterChange) {
            onFilterChange(newFilter);
        } else {
            this.setState({ filter: newFilter });
        }
    }

    /**
     * Focus the selected list-box whenever a form flags this component as invalid.
     *
     * @returns {void}
     */
    onHiddenFocus() {
        this.available.focus();
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
     * Returns the highlighted options from a given element.
     *
     * @param {Object} element
     *
     * @returns {Array}
     */
    getMarkedOptions(element) {
        if (element === null) {
            return [];
        }

        return Array.from(element.options)
            .filter((option) => option.selected)
            .map((option) => ({
                index: parseInt(option.dataset.index, 10),
                value: JSON.parse(option.dataset.realValue),
            }));
    }

    /**
     * Set the custom validity message when there is no selected option.
     *
     * @returns {void}
     */
    setValidityMessage() {
        const { lang, required } = this.props;
        const { selected } = this.state;

        // Irrelevant if not the caller has not made this component required
        if (!required) {
            return;
        }

        if (selected.length === 0) {
            this.hiddenInput.setCustomValidity(lang.requiredError);
        } else {
            this.hiddenInput.setCustomValidity('');
        }
    }

    /**
     * Re-arrange the marked options to move up or down in the selected list.
     *
     * @param {Array} markedOptions
     * @param {string} direction
     *
     * @returns {Array}
     */
    rearrangeSelected(markedOptions, direction) {
        const { selected } = this.state;
        let newOrder = [...selected];

        if (markedOptions.length === 0) {
            return newOrder;
        }

        if (direction === 'up') {
            // If all of the marked options are already as high as they can get, ignore the
            // re-arrangement request because they will end of swapping their order amongst
            // themselves.
            if (markedOptions[markedOptions.length - 1].index > markedOptions.length - 1) {
                markedOptions.forEach(({ index }) => {
                    if (index > 0) {
                        newOrder = swapOptions(index, index - 1)(newOrder);
                    }
                });
            }
        } else if (direction === 'down') {
            // Similar to the above, if all of the marked options are already as low as they can
            // get, ignore the re-arrangement request.
            if (markedOptions[0].index < selected.length - markedOptions.length) {
                markedOptions.reverse().forEach(({ index }) => {
                    if (index < selected.length - 1) {
                        newOrder = swapOptions(index, index + 1)(newOrder);
                    }
                });
            }
        }

        return newOrder;
    }

    /**
     * Move the marked options to the top or bottom of the selected options.
     *
     * @param {Array} markedOptions
     * @param {string} direction 'top' | 'bottom'
     *
     * @returns {Array}
     */
    rearrangeToExtremes(markedOptions, direction) {
        const { selected: selectedItems } = this.state;
        let unmarked = [...selectedItems];

        // Filter out marked options
        markedOptions.forEach(({ index }) => {
            unmarked[index] = null;
        });
        unmarked = unmarked.filter((v) => v !== null);

        // Condense marked options raw values
        const marked = markedOptions.map(({ index }) => selectedItems[index]);

        if (direction === 'top') {
            return [...marked, ...unmarked];
        }

        return [...unmarked, ...marked];
    }

    /**
     * Make all the given options selected, appending them after the existing selections.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    makeOptionsSelected(options) {
        const { selected } = this.state;
        const availableOptions = this.filterAvailable(options);

        return [
            ...selected,
            ...this.makeOptionsSelectedRecursive(availableOptions),
        ];
    }

    /**
     * Recursively make the given set of options selected.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    makeOptionsSelectedRecursive(options) {
        let newSelected = [];

        options.forEach((option) => {
            // Skip disabled options
            if (option.disabled) {
                return;
            }

            if (option.options !== undefined) {
                newSelected = [
                    ...newSelected,
                    ...this.makeOptionsSelectedRecursive(option.options),
                ];
            } else {
                newSelected.push(option.value);
            }
        });

        return newSelected;
    }

    /**
     * Make all the given options unselected, except for those disabled.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    makeOptionsUnselected(options) {
        const selected = this.filterSelected(options, true);

        return this.makeOptionsUnselectedRecursive(selected);
    }

    /**
     * Recursively unselect the given options, except for those disabled.
     *
     * @param {Array} selectedOptions
     *
     * @returns {Array}
     */
    makeOptionsUnselectedRecursive(selectedOptions) {
        let newSelected = [];

        selectedOptions.forEach((option) => {
            if (option.options !== undefined) {
                // Traverse any parents for leaf options
                newSelected = [
                    ...newSelected,
                    ...this.makeOptionsUnselectedRecursive(option.options),
                ];
            } else if (option.disabled) {
                // Preserve only disabled options
                newSelected.push(option.value);
            }
        });

        return newSelected;
    }

    /**
     * Toggle a set of highlighted elements.
     *
     * @param {Array} toggleItems
     * @param {string} controlKey
     *
     * @returns {Array}
     */
    toggleHighlighted(toggleItems, controlKey) {
        const { allowDuplicates } = this.props;
        const { selected } = this.state;
        const selectedItems = selected.slice(0);
        const toggleItemsMap = { ...selectedItems };

        // Add/remove the individual items based on previous state
        toggleItems.forEach(({ value, index }) => {
            const inSelectedOptions = selectedItems.indexOf(value) > -1;

            if (inSelectedOptions && (!allowDuplicates || controlKey === 'selected')) {
                // Toggled items that were previously selected are removed unless `allowDuplicates`
                // is set to true or the option was sourced from the selected ListBox. We use an
                // object mapping such that we can remove the exact index of the selected items
                // without the array re-arranging itself.
                delete toggleItemsMap[index];
            } else {
                selectedItems.push(value);
            }
        });

        // Convert object mapping back to an array
        if (controlKey === 'selected') {
            return Object.keys(toggleItemsMap).map((key) => toggleItemsMap[key]);
        }

        return selectedItems;
    }

    /**
     * Filter the given options by a ListBox filtering function and the user search string.
     *
     * @param {Array} options
     * @param {Function} filterer
     * @param {string} filterInput
     * @param {boolean} forceAllow
     *
     * @returns {Array}
     */
    filterOptions(options, filterer, filterInput, forceAllow = false) {
        const { canFilter, filterCallback } = this.props;
        const filtered = [];

        options.forEach((option) => {
            if (option.options !== undefined) {
                // Recursively filter any children
                const children = this.filterOptions(
                    option.options,
                    filterer,
                    filterInput,
                    // If the optgroup passes the filter, pre-clear all available children
                    forceAllow || filterCallback(option, filterInput),
                );

                if (children.length > 0) {
                    filtered.push({
                        ...option,
                        options: children,
                    });
                }
            } else {
                const subFiltered = [];
                // Run the main, non-search filter function against the given item
                const filterResult = filterer(option);

                if (Array.isArray(filterResult)) {
                    // The selected list box will be filtered by whether the given options have a
                    // selected index. This index will later be used when removing user selections.
                    // This index is particularly relevant for duplicate selections, as we want to
                    // preserve the removal order properly when `preserveSelectOrder` is set to
                    // true, rather than simply removing the first value encountered.
                    filterResult.forEach((index) => {
                        subFiltered.push({
                            ...option,
                            selectedIndex: index,
                        });
                    });
                } else if (filterResult) {
                    // Available options are much simpler and are merely filtered by a boolean
                    subFiltered.push(option);
                }

                // If any matched options go through, optionally apply user filtering and then add
                // these options to the filtered list. The text search filtering is applied AFTER
                // the main filtering to prevent unnecessary calls to the filterCallback function.
                if (subFiltered.length > 0) {
                    if (canFilter && !forceAllow && !filterCallback(option, filterInput)) {
                        return;
                    }

                    subFiltered.forEach((subItem) => {
                        filtered.push(subItem);
                    });
                }
            }
        });

        return filtered;
    }

    /**
     * Filter the available options.
     *
     * @param {Array} options
     * @param {boolean} noSearchFilter Ignore the search filter.
     *
     * @returns {Array}
     */
    filterAvailable(options, noSearchFilter = false) {
        const { allowDuplicates, available, simpleValue } = this.props;
        const { filter: { available: availableFilter }, selected } = this.state;

        const filters = [];

        // Apply user-defined available restrictions, if any
        if (available !== undefined) {
            const availableOptions = simpleValue ?
                available :
                DualListBox.flattenOptions(available);
            filters.push((option) => availableOptions.indexOf(option.value) >= 0);
        }

        // If duplicates are not allowed, filter out selected options
        if (!allowDuplicates) {
            filters.push((option) => selected.indexOf(option.value) < 0);
        }

        // Apply each filter function on the option
        const filterer = (option) => filters.reduce(
            (previousValue, filter) => previousValue && filter(option),
            true,
        );

        return this.filterOptions(options, filterer, availableFilter, noSearchFilter);
    }

    /**
     * Filter the selected options.
     *
     * @param {Array} options
     * @param {boolean} noSearchFilter Ignore the search filter.
     *
     * @returns {Array}
     */
    filterSelected(options, noSearchFilter = false) {
        const { preserveSelectOrder } = this.props;
        const { filter: { selected: selectedFilter }, selected } = this.state;

        if (preserveSelectOrder) {
            return this.filterSelectedByOrder(options);
        }

        // Order the selections by the default order
        return this.filterOptions(
            options,
            (option) => indexesOf(selected, option.value),
            selectedFilter,
            noSearchFilter,
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
        const { filter: { selected: selectedFilter }, selected } = this.state;
        const labelMap = this.getLabelMap(options);

        const selectedOptions = selected.map((value, index) => ({
            value,
            label: labelMap[value],
            selectedIndex: index,
        }));

        if (canFilter) {
            return selectedOptions.filter(
                (selectedOption) => filterCallback(selectedOption, selectedFilter),
            );
        }

        return selectedOptions;
    }

    /**
     * @param {Array} options
     *
     * @returns {Array}
     */
    renderOptions(options) {
        const { allowDuplicates } = this.props;
        const { id } = this.state;

        return options.map((option, index) => {
            const key = !allowDuplicates ?
                `${option.value}-${option.label}` :
                `${option.value}-${option.label}-${index}`;

            if (option.options !== undefined) {
                return (
                    <optgroup
                        key={key}
                        disabled={option.disabled}
                        id={`${id}-optgroup-${option.label}`}
                        label={option.label}
                        title={option.title}
                    >
                        {this.renderOptions(option.options)}
                    </optgroup>
                );
            }

            // If duplicates are allow, append the index to keep each entry unique such that the
            // controlled component can easily update its state.
            const value = !allowDuplicates ? option.value : `${option.value}-${index}`;

            return (
                <option
                    key={key}
                    data-index={option.selectedIndex}
                    data-real-value={JSON.stringify(option.value)}
                    disabled={option.disabled}
                    id={`${id}-option-${option.value}`}
                    title={option.title}
                    value={value}
                >
                    {option.label}
                </option>
            );
        });
    }

    /**
     * @param {string} controlKey
     * @param {Array} options
     * @param {function} ref
     * @param {ReactElement} actions
     *
     * @returns {ReactElement}
     */
    renderListBox(controlKey, options, ref, actions) {
        const {
            alignActions,
            canFilter,
            disabled,
            lang,
            showHeaderLabels,
            showNoOptionsText,
        } = this.props;
        const { filter, id, selections } = this.state;

        // Wrap event handlers with a controlKey reference
        const wrapHandler = (handler) => ((event) => handler(event, controlKey));

        return (
            <ListBox
                actions={alignActions === ALIGNMENTS.TOP ? actions : null}
                canFilter={canFilter}
                controlKey={controlKey}
                disabled={disabled}
                filterValue={filter[controlKey]}
                id={id}
                inputRef={(c) => {
                    this[controlKey] = c;

                    if (ref) {
                        ref(c);
                    }
                }}
                lang={lang}
                selections={selections[controlKey]}
                showHeaderLabels={showHeaderLabels}
                showNoOptionsText={showNoOptionsText}
                onDoubleClick={wrapHandler(this.onOptionDoubleClick)}
                onFilterChange={wrapHandler(this.onFilterChange)}
                onKeyUp={wrapHandler(this.onOptionKeyUp)}
                onSelectionChange={wrapHandler(this.onSelectionChange)}
            >
                {options}
            </ListBox>
        );
    }

    /**
     * @returns {ReactNode}
     */
    render() {
        const {
            alignActions,
            availableRef,
            canFilter,
            className,
            disabled,
            htmlDir,
            icons,
            iconsClass,
            lang,
            name,
            options,
            preserveSelectOrder,
            required,
            selectedRef,
            showHeaderLabels,
            showOrderButtons,
        } = this.props;
        const { id, selected } = this.state;
        const availableOptions = this.renderOptions(this.filterAvailable(options));
        const selectedOptions = this.renderOptions(this.filterSelected(options));
        const makeAction = (direction, isMoveAll = false) => (
            <Action
                direction={direction}
                disabled={disabled}
                icons={icons}
                id={id}
                isMoveAll={isMoveAll}
                lang={lang}
                onClick={this.onActionClick}
            />
        );
        const actionsRight = (
            <div className="rdl-actions-right">
                {makeAction('right', true)}
                {makeAction('right')}
            </div>
        );
        const actionsLeft = (
            <div className="rdl-actions-left">
                {makeAction('left')}
                {makeAction('left', true)}
            </div>
        );
        const rootClassName = classNames({
            'react-dual-listbox': true,
            [`rdl-icons-${iconsClass}`]: true,
            'rdl-has-filter': canFilter,
            'rdl-has-header': showHeaderLabels,
            'rdl-align-top': alignActions === ALIGNMENTS.TOP,
            ...(className && { [className]: true }),
        });
        const hiddenValue = selected.join(',');

        return (
            <div className={rootClassName} dir={htmlDir} id={id}>
                <div className="rdl-controls">
                    {this.renderListBox('available', availableOptions, availableRef, actionsRight)}
                    {alignActions === ALIGNMENTS.MIDDLE ? (
                        <div className="rdl-actions">
                            {actionsRight}
                            {actionsLeft}
                        </div>
                    ) : null}
                    {this.renderListBox('selected', selectedOptions, selectedRef, actionsLeft)}
                    {preserveSelectOrder && showOrderButtons ? (
                        <div className="rdl-actions">
                            {makeAction('top')}
                            {makeAction('up')}
                            {makeAction('down')}
                            {makeAction('bottom')}
                        </div>
                    ) : null}
                </div>
                <input
                    className="rdl-hidden-input"
                    disabled={disabled}
                    name={name}
                    ref={(c) => {
                        this.hiddenInput = c;
                    }}
                    required={required}
                    type={required ? 'text' : 'hidden'}
                    value={hiddenValue}
                    onChange={noop}
                    onFocus={this.onHiddenFocus}
                />
            </div>
        );
    }
}

export default DualListBox;
