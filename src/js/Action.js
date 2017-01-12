import React from 'react';

class Action extends React.Component {
	static propTypes = {
		direction: React.PropTypes.oneOf(['left', 'right']).isRequired,
		isMoveAll: React.PropTypes.bool,
		onClick: React.PropTypes.func.isRequired,
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
				type="button"
				className={className}
				onClick={onClick}
				data-move-direction={direction}
				data-move-all={isMoveAll ? 1 : 0}
			>
				{this.renderIcons(iconClass, isMoveAll)}
			</button>
		);
	}
}

export default Action;
