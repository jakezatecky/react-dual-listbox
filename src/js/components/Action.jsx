import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { IconContext, LanguageContext } from '../contexts';
import capitalizeFirstLetter from '../util/capitalizeFirstLetter';

const propTypes = {
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down', 'top', 'bottom']).isRequired,
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,

    isMoveAll: PropTypes.bool,
};
const defaultProps = {
    isMoveAll: false,
};

function Action(props) {
    function onClick() {
        const { direction, isMoveAll, onClick: parentOnClick } = props;

        parentOnClick({
            direction,
            isMoveAll,
        });
    }

    function getActionKey() {
        const { direction, isMoveAll } = props;

        return `move${isMoveAll ? 'All' : ''}${capitalizeFirstLetter(direction)}`;
    }

    const { disabled, id } = props;
    const actionKey = getActionKey();
    const { [actionKey]: icon } = useContext(IconContext);
    const { [actionKey]: label } = useContext(LanguageContext);
    const classKey = kebabCase(actionKey);
    const buttonId = `${id}-${classKey}`;
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
            id={buttonId}
            title={label}
            type="button"
            onClick={onClick}
        >
            {icon}
        </button>
    );
}

Action.propTypes = propTypes;
Action.defaultProps = defaultProps;

export default Action;
