import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

class Action extends React.Component {
	static propTypes = {
		direction: PropTypes.oneOf(['left', 'right']).isRequired,
		disabled: PropTypes.bool.isRequired,
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
	 * @param {string} direction
	 *
	 * @returns {string}
	 */
	getIconClass(direction) {
		if (direction === 'right') {
			return 'fa fa-chevron-right';
		}

		return 'fa fa-chevron-left';
	}

	getLabel(direction, isMoveAll) {
		const allText = isMoveAll ? ' all' : '';

		return `Move${allText} ${direction}`;
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
		const { direction, disabled, isMoveAll } = this.props;
		const iconClass = this.getIconClass(direction);
		const label = this.getLabel(direction, isMoveAll);
		const className = classNames({
			'rdl-move': true,
			'rdl-move-all': isMoveAll,
			'rdl-move-right': direction === 'right',
			'rdl-move-left': direction === 'left',
		});

		return (
			<button
				aria-label={label}
				className={className}
				disabled={disabled}
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
