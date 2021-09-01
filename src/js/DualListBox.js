import classNames from 'classnames';
import escapeRegExp from 'lodash/escapeRegExp';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React from 'react';
import { uniqBy } from 'lodash';
import Action from './Action';
import ListBox from './ListBox';
import defaultLang from './lang/default';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import optionsShape from './shapes/optionsShape';
import valueShape from './shapes/valueShape';
import arrayFrom from './util/arrayFrom';
import indexesOf from './util/indexesOf';

const KEY_CODES = {
    SPACEBAR: 32,
    ENTER: 13,
};
const ALIGNMENTS = {
    MIDDLE: 'middle',
    TOP: 'top',
};
const defaultFilter = (option, filterInput) => {
    if (filterInput === '') {
        return true;
    }

    return (new RegExp(escapeRegExp(filterInput), 'i')).test(option.label);
};
// Return a function to swap positions of the given indexes in an ordering
const swap = (index1, index2) => (
    (options) => {
        const newOptions = [...options];

        [newOptions[index1], newOptions[index2]] = [
            newOptions[index2],
            newOptions[index1],
        ];

        return newOptions;
    }
);
const defaultIcons = {
    moveLeft: <span className="fa fa-chevron-left" />,
    moveAllLeft: [
        <span key={0} className="fa fa-chevron-left" />,
        <span key={1} className="fa fa-chevron-left" />,
    ],
    moveRight: <span className="fa fa-chevron-right" />,
    moveAllRight: [
        <span key={0} className="fa fa-chevron-right" />,
        <span key={1} className="fa fa-chevron-right" />,
    ],
    moveTop: <span className="fa fa-angle-double-up" />,
    moveBottom: <span className="fa fa-angle-double-down" />,
    moveDown: <span className="fa fa-chevron-down" />,
    moveUp: <span className="fa fa-chevron-up" />,
};

class DualListBox extends React.Component {
    static propTypes = {
        options: optionsShape.isRequired,
        onChange: PropTypes.func.isRequired,
        PromiseSearchOptions: PropTypes.bool,
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
        filterPlaceholder: PropTypes.string,
        icons: iconsShape,
        id: PropTypes.string,
        lang: languageShape,
        moveKeyCodes: PropTypes.arrayOf(PropTypes.number),
        name: PropTypes.string,
        preserveSelectOrder: PropTypes.bool,
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
        filterPlaceholder: 'Search...',
        filterCallback: defaultFilter,
        icons: defaultIcons,
        id: null,
        lang: defaultLang,
        moveKeyCodes: [KEY_CODES.SPACEBAR, KEY_CODES.ENTER],
        name: null,
        preserveSelectOrder: null,
        selected: [],
        selectedRef: null,
        simpleValue: true,
        showHeaderLabels: false,
        showNoOptionsText: false,
        showOrderButtons: false,
        onFilterChange: null,
        PromiseSearchOptions: false,
    };

    /**
     * @param {Object} props
     *
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.state = {
            marked: [],
            filter: props.filter ? props.filter : {
                available: '',
                selected: '',
            },
            id: props.id || `rdl-${nanoid()}`,
        };

        this.onActionClick = this.onActionClick.bind(this);
        this.onOptionDoubleClick = this.onOptionDoubleClick.bind(this);
        this.onOptionKeyUp = this.onOptionKeyUp.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    /**
     * @param {Array} options
     * @param {Object} filter
     * @param {string|null} id
     * @param {Object} prevState
     *
     * @returns {Object}
     */
    static getDerivedStateFromProps({ filter, id }, prevState) {
        const newState = { ...prevState };

        if (filter !== null) {
            newState.filter = filter;
        }

        if (id !== null) {
            newState.id = id;
        }

        return newState;
    }

    /**
     * @param {Array} selected The new selected values
     * @param {Array} selection The options the user highlighted (if any)
     *
     * @returns {void}
     */
    onChange(selected, selection) {
        const { options, simpleValue, onChange } = this.props;
        const userSelection = selection.map(({ value, label }) => ({ value, label }));
        const userSelected = selected.map(({ value, label }) => ({ value, label }));

        if (simpleValue) {
            onChange(userSelected, selection);
        } else {
            const complexValues = { userSelected: [], userSelection: [] };
            const sourceValues = { userSelected, userSelection };

            // Reconstruct option objects for both the selected values and user selection
            Object.keys(sourceValues).forEach((key) => {
                // Reconstruct hierarchy from single-level options
                // Note that complex values become expensive if there are several options
                sourceValues[key].forEach((value) => {
                    options.forEach((option) => {
                        if (option.value) {
                            if (option.value === value.value) {
                                complexValues[key].push(option);
                            }
                        } else {
                            // Reconstruct optgroup options with those children
                            const subSelected = [];
                            option.options.forEach((subOption) => {
                                if (subOption.value === value.value) {
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

            onChange(complexValues.userSelected, complexValues.userSelection);
        }
    }

    /**
     * @param {string} direction
     * @param {boolean} isMoveAll
     *
     * @returns {void}
     */
    // eslint-disable-next-line consistent-return
    onActionClick({ direction, isMoveAll }) {
        const { options, PromiseSearchOptions, selected: selectedProps } = this.props;
        const { marked: markedState } = this.state;
        const directionIsRight = direction === 'right';
        const sourceListBox = directionIsRight ? this.available : this.selected;
        const marked = this.getMarkedOptions(sourceListBox);

        let selected;

        if (['up', 'down'].indexOf(direction) > -1) {
            selected = this.rearrangeSelected(marked, direction);
        } else if (['top', 'bottom'].indexOf(direction) > -1) {
            selected = this.moveToExtremes(marked, direction);
        } else if (isMoveAll) {
            if (!directionIsRight) {
                this.setState({
                    marked: [...selectedProps],
                });
            }
            selected = directionIsRight ?
                this.makeOptionsSelected(
                    PromiseSearchOptions ?
                        uniqBy([...options, ...selectedProps], 'value') :
                        options,
                ) :
                [];
        } else {
            if (marked.length === 0) {
                return null;
            }
            if (!directionIsRight) {
                this.setState({
                    marked: [
                        ...markedState,
                        ...(marked.length > 0 ? marked : selectedProps),
                    ],
                });
            }
            selected = this.toggleSelected(
                marked,
                directionIsRight ? 'available' : 'selected',
            );
        }

        this.onChange(selected, marked);
    }

    /**
     * @param {Object} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    onOptionDoubleClick(event, controlKey) {
        const marked = this.getMarkedOptions(event.currentTarget);
        const selected = this.toggleSelected(marked, controlKey);

        this.onChange(selected, marked);
    }

    /**
     * @param {Event} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    onOptionKeyUp(event, controlKey) {
        const { currentTarget, keyCode } = event;
        const { moveKeyCodes } = this.props;

        if (moveKeyCodes.indexOf(keyCode) > -1) {
            const marked = this.getMarkedOptions(currentTarget);
            const selected = this.toggleSelected(marked, controlKey);

            this.onChange(selected, marked);
        }
    }

    /**
     * @param {Event} event
     *
     * @returns {void}
     */
    onFilterChange(event) {
        const { onFilterChange, PromiseSearchOptions } = this.props;
        const { filter } = this.state;

        const newFilter = {
            ...filter,
            [event.target.dataset.key]: event.target.value,
        };

        if (onFilterChange) {
            onFilterChange(newFilter);
            if (PromiseSearchOptions) {
                this.setState({ marked: [] });
            }
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
            if (option.value !== undefined) {
                // Flatten single-level options
                flattened.push(option);
            } else if (option.options !== undefined) {
                // Flatten optgroup options
                option.options.forEach((subOption) => {
                    flattened.push(subOption);
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
     * Returns the highlighted options from a given element.
     *
     * @param {Object} element
     *
     * @returns {Array}
     */
    getMarkedOptions(element) {
        const { options, selected } = this.props;
        const labelMap = this.getLabelMap([...options, ...selected]);
        if (element === null) {
            return [];
        }

        return arrayFrom(element.options)
            .filter((option) => option.selected)
            .map((option) => (
                {
                    index: parseInt(option.dataset.index, 10),
                    value: JSON.parse(option.dataset.realValue),
                    label: labelMap[JSON.parse(option.dataset.realValue)],
                }
            ));
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
        const { selected } = this.props;
        const selectedItems = this.getFlatOptions(selected).slice(0);
        let newOrder = [...selectedItems];

        if (markedOptions.length === 0) {
            return newOrder;
        }

        if (direction === 'up') {
            // If all of the marked options are already as high as they can get, ignore the
            // re-arrangement request because they will end of swapping their order amongst
            // themselves.
            if (
                markedOptions[markedOptions.length - 1].index >
                markedOptions.length - 1
            ) {
                markedOptions.forEach(({ index }) => {
                    if (index > 0) {
                        newOrder = swap(index, index - 1)(newOrder);
                    }
                });
            }
        } else if (direction === 'down') {
            // Similar to the above, if all of the marked options are already as low as they can
            // get, ignore the re-arrangement request.
            if (
                markedOptions[0].index <
                selectedItems.length - markedOptions.length
            ) {
                markedOptions.reverse().forEach(({ index }) => {
                    if (index < selectedItems.length - 1) {
                        newOrder = swap(index, index + 1)(newOrder);
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
    moveToExtremes(markedOptions, direction) {
        const { selected } = this.props;
        const selectedItems = this.getFlatOptions(selected).slice(0);
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
        const { selected: previousSelected } = this.props;
        const availableOptions = this.filterAvailable(options);

        return [
            ...this.getFlatOptions(previousSelected),
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
            if (option.options !== undefined) {
                newSelected = [
                    ...newSelected,
                    ...this.makeOptionsSelectedRecursive(option.options),
                ];
            } else {
                newSelected.push(option);
            }
        });

        return newSelected;
    }

    /**
     * Toggle a new set of selected elements.
     *
     * @param {Array} toggleItems
     * @param {string} controlKey
     *
     * @returns {Array}
     */
    toggleSelected(toggleItems, controlKey) {
        const { allowDuplicates, selected } = this.props;
        const selectedItems = this.getFlatOptions(selected).slice(0);
        let toggleItemsFilter = [...selectedItems];

        // Add/remove the individual items based on previous state
        toggleItems.forEach((toggleItem) => {
            const inSelectedOptions = selectedItems.some(
                (selectedItem) => selectedItem.value === toggleItem.value,
            );

            if (
                inSelectedOptions &&
                (!allowDuplicates || controlKey === 'selected')
            ) {
                // Toggled items that were previously selected are removed unless `allowDuplicates`
                // is set to true or the option was sourced from the selected ListBox. We use an
                // object mapping such that we can remove the exact index of the selected items
                // without the array re-arranging itself.
                toggleItemsFilter = toggleItemsFilter.filter(
                    (itemFilter) => itemFilter.value !== toggleItem.value,
                );
                // delete toggleItemsMap[index];
            } else {
                selectedItems.push(toggleItem);
            }
        });

        // Convert object mapping back to an array
        if (controlKey === 'selected') {
            return toggleItemsFilter;
            // return Object.keys(toggleItemsMap).map((key) => toggleItemsMap[key]);
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
                    filterCallback(option, filterInput),
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
                    if (canFilter && !filterCallback(option, filterInput) && !forceAllow) {
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
     *
     * @returns {Array}
     */
    filterAvailable(options) {
        const {
            allowDuplicates, available, selected, PromiseSearchOptions,
        } = this.props;
        const { filter: { available: availableFilter } } = this.state;

        const filters = [];

        // Apply user-defined available restrictions, if any
        if (available !== undefined) {
            filters.push((option) => this.getFlatOptions(available).indexOf(option.value) >= 0);
        }

        // If duplicates are not allowed, filter out selected options
        if (!allowDuplicates) {
            filters.push((option) => this.getFlatOptions(selected).every(
                (selectedOption) => selectedOption.value !== option.value,
            ));
        }

        // Apply each filter function on the option
        const filterer = (option) => filters.reduce(
            (previousValue, filter) => previousValue && filter(option),
            true,
        );
        if (PromiseSearchOptions) {
            return this.filterOptions(options, filterer, '');
        }
        return this.filterOptions(options, filterer, availableFilter);
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
            (option) => indexesOf(this.getFlatOptions(selected), option),
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

        const selectedOptions = this.getFlatOptions(selected).map((option, index) => ({
            value: option.value,
            label: option?.label ? option?.label : labelMap[option.value],
            selectedIndex: index,
        }));

        if (canFilter) {
            return selectedOptions.filter(
                (selectedOption) => filterCallback(selectedOption, selectedFilter),
            ).map((option, index) => ({
                ...option,
                selectedIndex: index,
            }));
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
            filterPlaceholder,
            lang,
            showHeaderLabels,
            showNoOptionsText,
        } = this.props;
        const { filter, id } = this.state;

        // Wrap event handlers with a controlKey reference
        const wrapHandler = (handler) => ((event) => handler(event, controlKey));

        return (
            <ListBox
                actions={alignActions === ALIGNMENTS.TOP ? actions : null}
                canFilter={canFilter}
                controlKey={controlKey}
                disabled={disabled}
                filterPlaceholder={filterPlaceholder}
                filterValue={filter[controlKey]}
                id={id}
                inputRef={(c) => {
                    this[controlKey] = c;

                    if (ref) {
                        ref(c);
                    }
                }}
                lang={lang}
                showHeaderLabels={showHeaderLabels}
                showNoOptionsText={showNoOptionsText}
                onDoubleClick={wrapHandler(this.onOptionDoubleClick)}
                onFilterChange={wrapHandler(this.onFilterChange)}
                onKeyUp={wrapHandler(this.onOptionKeyUp)}
            >
                {options}
            </ListBox>
        );
    }

    /**
     * @returns {ReactElement}
     */
    render() {
        const {
            alignActions,
            availableRef,
            canFilter,
            className,
            disabled,
            icons,
            lang,
            name,
            options,
            preserveSelectOrder,
            selected,
            selectedRef,
            showHeaderLabels,
            showOrderButtons,
            PromiseSearchOptions,
        } = this.props;
        const { id, marked } = this.state;
        const availableOptions = PromiseSearchOptions ?
            this.renderOptions(
                this.filterAvailable(
                    uniqBy([...options, ...marked], 'value'),
                ),
            ) :
            this.renderOptions(this.filterAvailable(options));
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
            'rdl-has-filter': canFilter,
            'rdl-has-header': showHeaderLabels,
            'rdl-align-top': alignActions === ALIGNMENTS.TOP,
            ...(className && { [className]: true }),
        });
        const value = this.getFlatOptions(selected).join(',');

        return (
            <div className={rootClassName} id={id}>
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
                <input disabled={disabled} name={name} type="hidden" value={value} />
            </div>
        );
    }
}

export default DualListBox;
