import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import capitalizeFirstLetter from './util/capitalizeFirstLetter';

class Action extends React.Component {
    static propTypes = {
        direction: PropTypes.oneOf(['left', 'right', 'up', 'down', 'top', 'bottom']).isRequired,
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
    getId() {
        const { id, direction, isMoveAll } = this.props;

        return `${id}-move${isMoveAll ? '-all' : ''}-${direction}`;
    }

    /**
     * @returns {string}
     */
    getActionKey() {
        const { direction, isMoveAll } = this.props;

        return `move${isMoveAll ? 'All' : ''}${capitalizeFirstLetter(direction)}`;
    }

    /**
     * @returns {string}
     */
    getLabel() {
        const { lang } = this.props;

        return lang[this.getActionKey()];
    }

    /**
     * @returns {*}
     */
    renderIcons() {
        const { icons } = this.props;

        return icons[this.getActionKey()];
    }

    /**
     * @returns {React.Component}
     */
    render() {
        const {
            direction,
            disabled,
            isMoveAll,
        } = this.props;
        const id = this.getId();
        const label = this.getLabel();
        const className = classNames({
            'rdl-move': true,
            'rdl-move-all': isMoveAll,
            [`rdl-move-${direction}`]: true,
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
                {this.renderIcons()}
            </button>
        );
    }
}

export default Action;
