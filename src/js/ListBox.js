import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Filter from './Filter';
import languageShape from './shapes/languageShape';
import capitalizeFirstLetter from './util/capitalizeFirstLetter';

class ListBox extends React.Component {
    static propTypes = {
        canFilter: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        controlKey: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired,
        filterPlaceholder: PropTypes.string.isRequired,
        filterValue: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        inputRef: PropTypes.func.isRequired,
        lang: languageShape.isRequired,
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

    static defaultProps = {
        actions: null,
    };

    /**
     * @returns {ReactElement}
     */
    renderFilter() {
        const {
            canFilter,
            controlKey,
            disabled,
            filterPlaceholder,
            filterValue,
            id,
            lang,
            onFilterChange,
        } = this.props;

        if (!canFilter) {
            return null;
        }

        return (
            <Filter
                controlKey={controlKey}
                disabled={disabled}
                filterPlaceholder={filterPlaceholder}
                filterValue={filterValue}
                id={id}
                lang={lang}
                onFilterChange={onFilterChange}
            />
        );
    }

    /**
     * @returns {ReactElement}
     */
    renderSelect() {
        const {
            actions,
            children,
            disabled,
            controlKey,
            id,
            inputRef,
            lang,
            selections,
            showNoOptionsText,
            onDoubleClick,
            onKeyUp,
            onSelectionChange,
        } = this.props;

        if (showNoOptionsText && React.Children.count(children) === 0) {
            return (
                <div className="rdl-no-options">
                    {lang[`no${capitalizeFirstLetter(controlKey)}Options`]}
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

    render() {
        const {
            controlKey,
            id,
            lang,
            showHeaderLabels,
        } = this.props;
        const labelClassName = classNames({
            'rdl-control-label': true,
            'rdl-sr-only': !showHeaderLabels,
        });

        return (
            <div className={`rdl-list-box rdl-${controlKey}`}>
                <label className={labelClassName} htmlFor={`${id}-${controlKey}`}>
                    {lang[`${controlKey}Header`]}
                </label>
                {this.renderFilter()}
                {this.renderSelect()}
            </div>
        );
    }
}

export default ListBox;
