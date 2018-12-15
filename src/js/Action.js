import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import languageShape from './shapes/languageShape';

class Action extends React.Component {
    static propTypes = {
        direction: PropTypes.oneOf(['left', 'right']).isRequired,
        disabled: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired,
        lang: languageShape.isRequired,
        onClick: PropTypes.func.isRequired,

        isMoveAll: PropTypes.bool,
    };

    static defaultProps = {
        isMoveAll: false,
    };

    /**
     * @returns {void}
     */
    constructor() {
        super();

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
    getIconClass() {
        const { direction } = this.props;

        if (direction === 'right') {
            return 'fa fa-chevron-right';
        }

        return 'fa fa-chevron-left';
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
    getLabelKey() {
        const { direction, isMoveAll } = this.props;
        const directionCapitalized = direction.charAt(0).toUpperCase() + direction.slice(1);

        return `move${isMoveAll ? 'All' : ''}${directionCapitalized}`;
    }

    /**
     * @returns {string}
     */
    getLabel() {
        const { lang } = this.props;

        return lang[this.getLabelKey()];
    }

    /**
     * @param {string} iconClass
     * @param {boolean} isMoveAll
     *
     * @returns {*}
     */
    renderIcons(iconClass, isMoveAll) {
        if (isMoveAll) {
            return [
                <span key={0} className={iconClass} />,
                <span key={1} className={iconClass} />,
            ];
        }

        return <span className={iconClass} />;
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
        const iconClass = this.getIconClass();
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
                {this.renderIcons(iconClass, isMoveAll)}
            </button>
        );
    }
}

export default Action;
