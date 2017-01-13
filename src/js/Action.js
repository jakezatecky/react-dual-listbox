import React from 'react';

class Action extends React.Component {
	static propTypes = {
		direction: React.PropTypes.oneOf(['left', 'right']).isRequired,
		onClick: React.PropTypes.func.isRequired,

		isMoveAll: React.PropTypes.bool,
	};

	static defaultProps = {
		isMoveAll: false,
	};

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

	/**
	 * @param {string} iconClass
	 * @param {boolean} isMoveAll
	 *
	 * @returns {*}
	 */
	renderIcons(iconClass, isMoveAll) {
		if (isMoveAll) {
			return [
				<i key={0} className={iconClass} />,
				<i key={1} className={iconClass} />,
			];
		}

		return <i className={iconClass} />;
	}

	/**
	 * @returns {React.Component}
	 */
	render() {
		const { direction, isMoveAll, onClick } = this.props;
		const iconClass = this.getIconClass(direction);
		const className = isMoveAll ? 'rdl-btn rdl-btn-all' : 'rdl-btn';

		return (
			<button
				className={className}
				data-move-all={isMoveAll ? 1 : 0}
				data-move-direction={direction}
				type="button"
				onClick={onClick}
			>
				{this.renderIcons(iconClass, isMoveAll)}
			</button>
		);
	}
}

export default Action;
