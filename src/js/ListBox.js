import React from 'react';

class ListBox extends React.Component {
	static propTypes = {
		canFilter: React.PropTypes.bool.isRequired,
		children: React.PropTypes.node.isRequired,
		controlKey: React.PropTypes.string.isRequired,
		displayName: React.PropTypes.string.isRequired,
		filterPlaceholder: React.PropTypes.string.isRequired,
		filterValue: React.PropTypes.string.isRequired,
		id: React.PropTypes.string.isRequired,
		inputRef: React.PropTypes.func.isRequired,
		onDoubleClick: React.PropTypes.func.isRequired,
		onFilterChange: React.PropTypes.func.isRequired,
		onKeyUp: React.PropTypes.func.isRequired,

		actions: React.PropTypes.node,
	};

	static defaultProps = {
		actions: null,
	};

	/**
	 * @returns {React.Component}
	 */
	renderFilter() {
		const {
			canFilter,
			controlKey,
			displayName,
			filterPlaceholder,
			filterValue,
			id,
			onFilterChange,
		} = this.props;

		if (!canFilter) {
			return null;
		}

		return (
			<div className="rdl-filter-container">
				<label className="rdl-control-label" htmlFor={`${id}-filter-${controlKey}`}>
					Filter {displayName}
				</label>
				<input
					className="rdl-filter"
					data-key={controlKey}
					id={`${id}-filter-${controlKey}`}
					placeholder={filterPlaceholder}
					type="text"
					value={filterValue}
					onChange={onFilterChange}
				/>
			</div>
		);
	}

	/**
	 * @returns {React.Component}
	 */
	renderSelect() {
		const { children, controlKey, displayName, id, inputRef, onDoubleClick, onKeyUp } = this.props;

		return (
			<div className="rdl-control-container">
				<label className="rdl-control-label" htmlFor={`${id}-${controlKey}`}>
					{displayName}
				</label>
				<select
					className="rdl-control"
					id={`${id}-${controlKey}`}
					multiple
					ref={inputRef}
					onDoubleClick={onDoubleClick}
					onKeyUp={onKeyUp}
				>
					{children}
				</select>
			</div>
		);
	}

	render() {
		const { actions, controlKey } = this.props;

		return (
			<div className={`rdl-listbox rdl-${controlKey}`}>
				{this.renderFilter()}
				{actions}
				{this.renderSelect()}
			</div>
		);
	}
}

export default ListBox;
