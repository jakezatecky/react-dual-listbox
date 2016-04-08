import React from 'react';

import Action from './Action';

class DualListBox extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
		options: React.PropTypes.array,
	};

	/**
	 * @param {Object} props
	 *
	 * @returns {void}
	 */
	constructor(props) {
		super(props);

		this.state = { selected: [] };

		this.onClick = this.onClick.bind(this);
		this.onDoubleClick = this.onDoubleClick.bind(this);
	}

	/**
	 * @param {Object} event
	 *
	 * @return {void}
	 */
	onClick(event) {
		const { target } = event;
		const { options } = this.props;
		const direction = target.dataset.moveDirection;
		const isMoveAll = target.dataset.moveAll;
		const selectRef = direction === 'right' ? 'available' : 'selected';

		let { selected } = this.state;

		if (isMoveAll === '1') {
			selected = direction === 'right' ? this.makeOptionsSelected(options) : [];
		} else {
			selected = this.toggleSelected(
				this.getSelectedOptions(this.refs[selectRef])
			);
		}

		this.setState({ selected });
	}

	/**
	 * @param {Object} event
	 *
	 * @returns {void}
	 */
	onDoubleClick(event) {
		const value = event.target.value;
		const selected = this.toggleSelected([value]);

		this.setState({ selected });
	}

	/**
	 * Returns the selected options from a given element.
	 *
	 * @param {Object} element
	 *
	 * @returns {Array}
	 */
	getSelectedOptions(element) {
		return [...element.options]
			.filter((option) => option.selected)
			.map((option) => option.value);
	}

	/**
	 * Make all the given options selected.
	 *
	 * @param {Array} options
	 *
	 * @returns {Array}
	 */
	makeOptionsSelected(options) {
		let selected = [];

		options.forEach((option) => {
			if (option.options !== undefined) {
				selected = [...selected, ...this.makeOptionsSelected(option.options)];
			} else {
				selected.push(option.value);
			}
		});

		return selected;
	}

	/**
	 * Toggle a new set of selected elements.
	 *
	 * @param {Array} selected
	 *
	 * @returns {Array}
	 */
	toggleSelected(selected) {
		const oldSelected = this.state.selected;

		selected.forEach((value) => {
			const index = oldSelected.indexOf(value);

			if (index >= 0) {
				oldSelected.splice(index, 1);
			} else {
				oldSelected.push(value);
			}
		});

		return oldSelected;
	}

	/**
	 * Filter options by a filtering function.
	 *
	 * @param {Array} options
	 * @param {Function} filterer
	 *
	 * @returns {Array}
	 */
	filterOptions(options, filterer) {
		const filtered = [];

		options.forEach((option) => {
			if (option.options !== undefined) {
				const children = this.filterOptions(option.options, filterer);

				if (children.length > 0) {
					filtered.push({
						label: option.label,
						options: children,
					});
				}
			} else if (filterer(option)) {
				filtered.push(option);
			}
		});

		return filtered;
	}

	/**
	 * @returns {Array}
	 */
	renderOptions(options) {
		return options.map((option, index) => {
			if (option.options !== undefined) {
				return (
					<optgroup key={index} label={option.label}>
						{this.renderOptions(option.options)}
					</optgroup>
				);
			}

			return (
				<option key={index} value={option.value} onDoubleClick={this.onDoubleClick}>
					{option.label}
				</option>
			);
		});
	}

	/**
	 * @returns {React.Component}
	 */
	render() {
		const available = this.renderOptions(this.filterOptions(
			this.props.options,
			(option) => this.state.selected.indexOf(option.value) < 0
		));
		const selected = this.renderOptions(this.filterOptions(
			this.props.options,
			(option) => this.state.selected.indexOf(option.value) >= 0
		));

		return (
			<div className="react-dual-listbox">
				<div className="rdl-available">
					<select className="form-control" ref="available" multiple>
						{available}
					</select>
				</div>
				<div className="rdl-actions">
					<div className="rdl-actions-right">
						<Action direction="right" isMoveAll onClick={this.onClick} />
						<Action direction="right" onClick={this.onClick} />
					</div>
					<div className="rdl-actions-left">
						<Action direction="left" onClick={this.onClick} />
						<Action direction="left" isMoveAll onClick={this.onClick} />
					</div>
				</div>
				<div className="rdl-selected">
					<select className="form-control" name={this.props.name} ref="selected" multiple>
						{selected}
					</select>
				</div>
			</div>
		);
	}
}

export default DualListBox;
