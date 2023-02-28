import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';

import iconsShape from '../shapes/iconsShape';
import languageShape from '../shapes/languageShape';
import capitalizeFirstLetter from '../util/capitalizeFirstLetter';

const propTypes = {
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down', 'top', 'bottom']).isRequired,
    disabled: PropTypes.bool.isRequired,
    icons: iconsShape.isRequired,
    id: PropTypes.string.isRequired,
    lang: languageShape.isRequired,
    onClick: PropTypes.func.isRequired,

    isMoveAll: PropTypes.bool,
};
const defaultProps = {
    isMoveAll: false,
};

/**
 * @returns {ReactNode}
 */
function Action(props) {
    /**
     * @returns {void}
     */
    function onClick() {
        const { direction, isMoveAll, onClick: parentOnClick } = props;

        parentOnClick({
            direction,
            isMoveAll,
        });
    }

    /**
     * @returns {string}
     */
    function getActionKey() {
        const { direction, isMoveAll } = props;

        return `move${isMoveAll ? 'All' : ''}${capitalizeFirstLetter(direction)}`;
    }

    /**
     * @returns {string}
     */
    function getId(classKey) {
        const { id } = props;

        return `${id}-${classKey}`;
    }

    /**
     * @param {string} actionKey
     *
     * @returns {string}
     */
    function getLabel(actionKey) {
        const { lang } = props;

        return lang[actionKey];
    }

    /**
     * @param {string} actionKey
     *
     * @returns {*}
     */
    function renderIcons(actionKey) {
        const { icons } = props;

        return icons[actionKey];
    }

    const { disabled } = props;
    const actionKey = getActionKey();
    const classKey = kebabCase(actionKey);
    const id = getId(classKey);
    const label = getLabel(actionKey);
    const className = classNames({
        'rdl-btn': true,
        'rdl-move': true,
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
            onClick={onClick}
        >
            {renderIcons(actionKey)}
        </button>
    );
}

Action.propTypes = propTypes;
Action.defaultProps = defaultProps;

export default Action;
