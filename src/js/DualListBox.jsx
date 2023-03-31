import classNames from 'classnames';
import escapeRegExp from 'lodash/escapeRegExp';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import Action from './components/Action';
import HiddenInput from './components/HiddenInput';
import ListBox from './components/ListBox';
import defaultLang from './lang/default';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import optionsShape from './shapes/optionsShape';
import valueShape from './shapes/valueShape';
import indexesOf from './util/indexesOf';
import swapOptions from './util/swapOptions';
import { ALIGNMENTS, KEYS } from './constants';
import { IconContext, LanguageContext } from './contexts';

const refShape = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
]);
const defaultFilter = (option, filterInput, { getOptionLabel }) => {
    if (filterInput === '') {
        return true;
    }

    return (new RegExp(escapeRegExp(filterInput), 'i')).test(getOptionLabel(option));
};
const defaultIcons = {
    moveToAvailable: <span className="rdl-icon rdl-icon-move-to-available" />,
    moveAllToAvailable: <span className="rdl-icon rdl-icon-move-all-to-available" />,
    moveToSelected: <span className="rdl-icon rdl-icon-move-to-selected" />,
    moveAllToSelected: <span className="rdl-icon rdl-icon-move-all-to-selected" />,
    moveBottom: <span className="rdl-icon rdl-icon-move-bottom" />,
    moveDown: <span className="rdl-icon rdl-icon-move-down" />,
    moveUp: <span className="rdl-icon rdl-icon-move-up" />,
    moveTop: <span className="rdl-icon rdl-icon-move-top" />,
};
const combineMemoized = memoize((newValue, defaultValue) => ({ ...defaultValue, ...newValue }));

const propTypes = {
    options: optionsShape.isRequired,
    onChange: PropTypes.func.isRequired,

    alignActions: PropTypes.oneOf([ALIGNMENTS.MIDDLE, ALIGNMENTS.TOP]),
    allowDuplicates: PropTypes.bool,
    available: valueShape,
    availableRef: refShape,
    canFilter: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    filter: PropTypes.shape({
        available: PropTypes.string.isRequired,
        selected: PropTypes.string.isRequired,
    }),
    filterCallback: PropTypes.func,
    getOptionLabel: PropTypes.func,
    getOptionValue: PropTypes.func,
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
    selectedRef: refShape,
    showHeaderLabels: PropTypes.bool,
    showNoOptionsText: PropTypes.bool,
    showOrderButtons: PropTypes.bool,
    onFilterChange: PropTypes.func,
};
const defaultProps = {
    alignActions: ALIGNMENTS.MIDDLE,
    allowDuplicates: false,
    available: undefined,
    availableRef: null,
    canFilter: false,
    className: null,
    disabled: false,
    filter: null,
    filterCallback: defaultFilter,
    getOptionLabel: ({ label }) => label,
    getOptionValue: ({ value }) => value,
    htmlDir: 'ltr',
    icons: defaultIcons,
    iconsClass: 'fa5',
    id: 'rdl',
    lang: defaultLang,
    moveKeys: [KEYS.SPACEBAR, KEYS.ENTER],
    name: null,
    preserveSelectOrder: null,
    required: false,
    selected: [],
    selectedRef: null,
    showHeaderLabels: false,
    showNoOptionsText: false,
    showOrderButtons: false,
    onFilterChange: null,
};

function DualListBox(props) {
    const { selected, filter: filterProp } = props;
    const availableRef = useRef(null);
    const selectedRef = useRef(null);
    const [filter, setFilter] = useState(filterProp !== null ? filterProp : {
        available: '',
        selected: '',
    });
    const [selections, setSelections] = useState({
        available: [],
        selected: [],
    });

    useEffect(() => {
        if (filterProp !== null) {
            setFilter(filterProp);
        }
    }, [filterProp]);

    /**
     * Converts a flat array to a key/value mapping for duplicated value reference.
     *
     * @param {Array} options
     *
     * @returns {Object}
     */
    function getValueMap(options) {
        const { getOptionValue } = props;
        let labelMap = {};

        options.forEach((option) => {
            const value = getOptionValue(option);
            const { options: children } = option;

            if (children !== undefined) {
                labelMap = { ...labelMap, ...getValueMap(children) };
            } else {
                labelMap[value] = option;
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
    function getMarkedOptions(element) {
        if (element === null) {
            return [];
        }

        return Array.from(element.options)
            .filter(({ selected: isSelected }) => isSelected)
            .map(({ dataset: { index, realValue } }) => ({
                index: parseInt(index, 10),
                value: JSON.parse(realValue),
            }));
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
    function filterOptions(options, filterer, filterInput, forceAllow = false) {
        const { canFilter, filterCallback } = props;
        const filtered = [];

        options.forEach((option) => {
            if (option.options !== undefined) {
                // Recursively filter any children
                const children = filterOptions(
                    option.options,
                    filterer,
                    filterInput,
                    // If the optgroup passes the filter, pre-clear all available children
                    forceAllow || filterCallback(option, filterInput, props),
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
                    if (
                        canFilter &&
                        !forceAllow &&
                        !filterCallback(option, filterInput, props)
                    ) {
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
    function filterAvailable(options, noSearchFilter = false) {
        const { allowDuplicates, available, getOptionValue } = props;
        const { available: availableFilter } = filter;

        const filters = [];

        // Apply user-defined available restrictions, if any
        if (available !== undefined) {
            filters.push((option) => available.indexOf(getOptionValue(option)) >= 0);
        }

        // If duplicates are not allowed, filter out selected options
        if (!allowDuplicates) {
            filters.push((option) => selected.indexOf(getOptionValue(option)) < 0);
        }

        // Apply each filter function on the option
        const filterer = (option) => filters.reduce(
            (previousValue, filterFunction) => previousValue && filterFunction(option),
            true,
        );

        return filterOptions(options, filterer, availableFilter, noSearchFilter);
    }

    /**
     * Preserve the selection order. This drops the opt-group associations.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    function filterSelectedByOrder(options) {
        const { canFilter, filterCallback } = props;
        const { selected: selectedFilter } = filter;
        const valueMap = getValueMap(options);

        const selectedOptions = selected.map((value, index) => ({
            ...valueMap[value],
            selectedIndex: index,
        }));

        if (canFilter) {
            return selectedOptions.filter(
                (selectedOption) => filterCallback(selectedOption, selectedFilter, props),
            );
        }

        return selectedOptions;
    }

    /**
     * Filter the selected options.
     *
     * @param {Array} options
     * @param {boolean} noSearchFilter Ignore the search filter.
     *
     * @returns {Array}
     */
    function filterSelected(options, noSearchFilter = false) {
        const { getOptionValue, preserveSelectOrder } = props;
        const { selected: selectedFilter } = filter;

        if (preserveSelectOrder) {
            return filterSelectedByOrder(options);
        }

        // Order the selections by the default order
        return filterOptions(
            options,
            (option) => indexesOf(selected, getOptionValue(option)),
            selectedFilter,
            noSearchFilter,
        );
    }

    /**
     * Re-arrange the marked options to move up or down in the selected list.
     *
     * @param {Array} markedOptions
     * @param {string} direction
     *
     * @returns {Array}
     */
    function rearrangeSelected(markedOptions, direction) {
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
    function rearrangeToExtremes(markedOptions, direction) {
        let unmarked = [...selected];

        // Filter out marked options
        markedOptions.forEach(({ index }) => {
            unmarked[index] = null;
        });
        unmarked = unmarked.filter((v) => v !== null);

        // Condense marked options raw values
        const marked = markedOptions.map(({ index }) => selected[index]);

        if (direction === 'top') {
            return [...marked, ...unmarked];
        }

        return [...unmarked, ...marked];
    }

    /**
     * Recursively make the given set of options selected.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    function makeOptionsSelectedRecursive(options) {
        const { getOptionValue } = props;
        let newSelected = [];

        options.forEach((option) => {
            // Skip disabled options
            if (option.disabled) {
                return;
            }

            if (option.options !== undefined) {
                newSelected = [
                    ...newSelected,
                    ...makeOptionsSelectedRecursive(option.options),
                ];
            } else {
                newSelected.push(getOptionValue(option));
            }
        });

        return newSelected;
    }

    /**
     * Make all the given options selected, appending them after the existing selections.
     *
     * @param {Array} options
     *
     * @returns {Array}
     */
    function makeOptionsSelected(options) {
        const availableOptions = filterAvailable(options);

        return [
            ...selected,
            ...makeOptionsSelectedRecursive(availableOptions),
        ];
    }

    /**
     * Recursively unselect the given options, except for those disabled.
     *
     * @param {Array} selectedOptions
     *
     * @returns {Array}
     */
    function makeOptionsUnselectedRecursive(selectedOptions) {
        const { getOptionValue } = props;
        let newSelected = [];

        selectedOptions.forEach((option) => {
            if (option.options !== undefined) {
                // Traverse any parents for leaf options
                newSelected = [
                    ...newSelected,
                    ...makeOptionsUnselectedRecursive(option.options),
                ];
            } else if (option.disabled) {
                // Preserve only disabled options
                newSelected.push(getOptionValue(option));
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
    function makeOptionsUnselected(options) {
        return makeOptionsUnselectedRecursive(filterSelected(options, true));
    }

    /**
     * Toggle a set of highlighted elements.
     *
     * @param {Array} toggleItems
     * @param {string} controlKey
     *
     * @returns {Array}
     */
    function toggleHighlighted(toggleItems, controlKey) {
        const { allowDuplicates } = props;
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
     * @param {Array} newSelected The new selected values
     * @param {Array} selection The options the user highlighted (if any)
     * @param {string} controlKey The key for the control that fired this event.
     * @param {boolean} isRearrange Whether the change is a result of re-arrangement.
     *
     * @returns {void}
     */
    function onChange(newSelected, selection, controlKey, isRearrange = false) {
        const { onChange: onChangeProp } = props;
        const userSelection = selection.map(({ value }) => value);

        onChangeProp(newSelected, userSelection, controlKey);

        // Reset selections after moving items for cleaner experience and to remove invalid values
        // Note that this should not occur for re-arrangement operations
        if (!isRearrange) {
            setSelections({
                ...selections,
                [controlKey]: [],
            });
        }
    }

    /**
     * @param {string} direction
     * @param {boolean} isMoveAll
     *
     * @returns {void}
     */
    const onActionClick = useCallback(({ direction, isMoveAll }) => {
        const { options } = props;
        const isToSelected = direction === 'toSelected';
        const sourceListBox = isToSelected ? availableRef : selectedRef;
        const marked = getMarkedOptions(sourceListBox.current);
        let isRearrangement = false;

        let newSelected;

        if (['up', 'down'].indexOf(direction) > -1) {
            isRearrangement = true;
            newSelected = rearrangeSelected(marked, direction);
        } else if (['top', 'bottom'].indexOf(direction) > -1) {
            isRearrangement = true;
            newSelected = rearrangeToExtremes(marked, direction);
        } else if (isMoveAll) {
            newSelected = isToSelected ?
                makeOptionsSelected(options) :
                makeOptionsUnselected(options);
        } else {
            newSelected = toggleHighlighted(
                marked,
                isToSelected ? 'available' : 'selected',
            );
        }

        onChange(newSelected, marked, isToSelected ? 'available' : 'selected', isRearrangement);
    }, [selected]);

    /**
     * @param {Object} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    const onOptionDoubleClick = useCallback((event, controlKey) => {
        const marked = getMarkedOptions(event.currentTarget);
        const newSelected = toggleHighlighted(marked, controlKey);

        onChange(newSelected, marked, controlKey);
    }, [selected]);

    /**
     * @param {Event} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    const onOptionKeyUp = useCallback((event, controlKey) => {
        const { currentTarget, key } = event;
        const { moveKeys } = props;

        if (moveKeys.indexOf(key) > -1) {
            const marked = getMarkedOptions(currentTarget);
            const newSelected = toggleHighlighted(marked, controlKey);

            onChange(newSelected, marked, controlKey);
        }
    }, [selected]);

    /**
     * @param {Event} event
     * @param {string} controlKey
     *
     * @returns {void}
     */
    const onSelectionChange = useCallback((event, controlKey) => {
        const { target: { options } } = event;

        const newSelections = Array.from(options)
            .filter(({ selected: isSelected }) => isSelected)
            .map(({ value }) => value);

        setSelections({
            ...selections,
            [controlKey]: newSelections,
        });
    }, [selections]);

    /**
     * @param {Event} event
     *
     * @returns {void}
     */
    const onFilterChangeCallback = useCallback((event) => {
        const { onFilterChange } = props;
        const { target: { value, dataset: { controlKey } } } = event;

        const newFilter = { ...filter, [controlKey]: value };

        if (onFilterChange) {
            onFilterChange(newFilter);
        } else {
            setFilter(newFilter);
        }
    }, [filter]);

    /**
     * Focus the selected list-box whenever a form flags this component as invalid.
     *
     * @returns {void}
     */
    const onHiddenFocus = useCallback(() => {
        availableRef.current.focus();
    }, []);

    /**
     * @param {Array} options
     *
     * @returns {Array}
     */
    function renderOptions(options) {
        const { allowDuplicates, getOptionLabel, getOptionValue } = props;

        return options.map((option, index) => {
            const label = getOptionLabel(option);
            const value = getOptionValue(option);
            const key = !allowDuplicates ?
                `${value}-${label}` :
                `${value}-${label}-${index}`;

            if (option.options !== undefined) {
                return (
                    <optgroup
                        key={key}
                        disabled={option.disabled}
                        label={label}
                        title={option.title}
                    >
                        {renderOptions(option.options)}
                    </optgroup>
                );
            }

            // If we allow duplicates, append the index to keep each entry unique such that the
            // controlled component can easily update its state
            const optionValue = !allowDuplicates ? value : `${value}-${index}`;

            return (
                <option
                    key={key}
                    data-index={option.selectedIndex}
                    data-real-value={JSON.stringify(value)}
                    disabled={option.disabled}
                    title={option.title}
                    value={optionValue}
                >
                    {label}
                </option>
            );
        });
    }

    /**
     * @param {string} controlKey
     * @param {Array} options
     * @param {React.MutableRefObject} ref
     * @param {JSX.Element} actions
     *
     * @returns {JSX.Element}
     */
    function renderListBox(controlKey, options, ref, actions) {
        const {
            alignActions,
            canFilter,
            [`${controlKey}Ref`]: refProp,
            disabled,
            id,
            showHeaderLabels,
            showNoOptionsText,
        } = props;

        // Wrap event handlers with a controlKey reference
        const wrapHandler = (handler) => ((event) => handler(event, controlKey));

        // Set both internal ref and property ref
        /* eslint-disable no-param-reassign */
        const makeRef = (c) => {
            ref.current = c;

            if (refProp !== null) {
                if (typeof refProp === 'function') {
                    refProp(c);
                } else {
                    refProp.current = c;
                }
            }
        };
        /* eslint-enable no-param-reassign */

        return (
            <ListBox
                actions={alignActions === ALIGNMENTS.TOP ? actions : null}
                canFilter={canFilter}
                controlKey={controlKey}
                disabled={disabled}
                filterValue={filter[controlKey]}
                id={id}
                inputRef={makeRef}
                selections={selections[controlKey]}
                showHeaderLabels={showHeaderLabels}
                showNoOptionsText={showNoOptionsText}
                onDoubleClick={wrapHandler(onOptionDoubleClick)}
                onFilterChange={wrapHandler(onFilterChangeCallback)}
                onKeyUp={wrapHandler(onOptionKeyUp)}
                onSelectionChange={wrapHandler(onSelectionChange)}
            >
                {options}
            </ListBox>
        );
    }

    const {
        alignActions,
        canFilter,
        className,
        disabled,
        htmlDir,
        icons,
        iconsClass,
        id,
        lang,
        name,
        options,
        preserveSelectOrder,
        required,
        showHeaderLabels,
        showOrderButtons,
    } = props;
    const mergedLang = combineMemoized(lang, defaultLang);
    const mergedIcons = combineMemoized(icons, defaultIcons);
    const availableOptions = renderOptions(filterAvailable(options));
    const selectedOptions = renderOptions(filterSelected(options));
    const makeAction = (direction, isMoveAll = false) => (
        <Action
            direction={direction}
            disabled={disabled}
            isMoveAll={isMoveAll}
            onClick={onActionClick}
        />
    );
    const actionsToSelected = (
        <div className="rdl-actions-to-selected">
            {makeAction('toSelected', true)}
            {makeAction('toSelected')}
        </div>
    );
    const actionsToAvailable = (
        <div className="rdl-actions-to-available">
            {makeAction('toAvailable')}
            {makeAction('toAvailable', true)}
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

    return (
        <LanguageContext.Provider value={mergedLang}>
            <IconContext.Provider value={mergedIcons}>
                <div className={rootClassName} dir={htmlDir} id={id}>
                    <div className="rdl-controls">
                        {renderListBox('available', availableOptions, availableRef, actionsToSelected)}
                        {alignActions === ALIGNMENTS.MIDDLE ? (
                            <div className="rdl-actions">
                                {actionsToSelected}
                                {actionsToAvailable}
                            </div>
                        ) : null}
                        {renderListBox('selected', selectedOptions, selectedRef, actionsToAvailable)}
                        {preserveSelectOrder && showOrderButtons ? (
                            <div className="rdl-actions">
                                {makeAction('top')}
                                {makeAction('up')}
                                {makeAction('down')}
                                {makeAction('bottom')}
                            </div>
                        ) : null}
                    </div>
                    <HiddenInput
                        disabled={disabled}
                        name={name}
                        required={required}
                        selected={selected}
                        onFocus={onHiddenFocus}
                    />
                </div>
            </IconContext.Provider>
        </LanguageContext.Provider>
    );
}

DualListBox.propTypes = propTypes;
DualListBox.defaultProps = defaultProps;

export { propTypes, defaultProps };
export default DualListBox;
