import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';

import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import capitalizeFirstLetter from './util/capitalizeFirstLetter';

class Action extends React.Component {
    static propTypes = {
        direction: PropTypes.oneOf([
            'toAvailable',
            'toSelected',
            'up',
            'down',
            'top',
            'bottom',
        ]).isRequired,
        disabled: PropTypes.bool.isRequired,
        icons: iconsShape.isRequired,
        id: PropTypes.string.isRequired,
        lang: languageShape.isRequired,
        onClick: PropTypes.func.isRequired,

        isMoveAll: PropTypes.bool,
    };

    static defaultProps = {
        isMoveAll: false,
    };

    /**
     * @param {Object} props
     *
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    /**
     * @returns {void}
     */
    onClick() {
        const { direction, isMoveAll, onClick } = this.props;

        onClick({
            direction,
            isMoveAll,
        });
    }

    /**
     * @returns {string}
     */
    getActionKey() {
        const { direction, isMoveAll } = this.props;

        return `move${isMoveAll ? 'All' : ''}${capitalizeFirstLetter(direction)}`;
    }

    /**
     * @param {string} classKey
     *
     * @returns {string}
     */
    getId(classKey) {
        const { id, isMoveAll } = this.props;

        return `${id}-move${isMoveAll ? '-all' : ''}-${classKey}`;
    }

    /**
     * @param {string} actionKey
     *
     * @returns {string}
     */
    getLabel(actionKey) {
        const { lang } = this.props;

        return lang[actionKey];
    }

    /**
     * @param {string} actionKey
     *
     * @returns {ReactNode}
     */
    renderIcons(actionKey) {
        const { icons } = this.props;

        return icons[actionKey];
    }

    /**
     * @returns {ReactNode}
     */
    render() {
        const {
            disabled,
            isMoveAll,
        } = this.props;
        const actionKey = this.getActionKey();
        const classKey = kebabCase(actionKey);
        const id = this.getId(classKey);
        const label = this.getLabel(actionKey);
        const className = classNames({
            'rdl-btn': true,
            'rdl-move': true,
            'rdl-move-all': isMoveAll,
            'rdl-move-some': !isMoveAll,
            [`rdl-${classKey}`]: true,
        });

        return (
            <button
                aria-label={label}
                className={className}
                disabled={disabled}
                id={id}
                title={label}
                type="button"
                onClick={this.onClick}
            >
                {this.renderIcons(actionKey)}
            </button>
        );
    }
}

export default Action;
