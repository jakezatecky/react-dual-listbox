import classNames from 'classnames';
import React from 'react';
import shortid from 'shortid';

import Action from './Action';
import arrayFrom from './arrayFrom';

const optionShape = React.PropTypes.shape({
	value: React.PropTypes.any.isRequired,
	label: React.PropTypes.string.isRequired,
});

const defaultFilter = (option, filterInput) => {
	if (filterInput === '') {
		return true;
	}

	return (new RegExp(filterInput, 'i')).test(option.label);
};

class DualListBox extends React.Component {
	static propTypes = {
		options: React.PropTypes.arrayOf(
			React.PropTypes.oneOfType([
				optionShape,
				React.PropTypes.shape({
					value: React.PropTypes.any,
					options: React.PropTypes.arrayOf(optionShape),
				}),
			]),
		).isRequired,
		onChange: React.PropTypes.func.isRequired,

		available: React.PropTypes.arrayOf(React.PropTypes.string),
		availableRef: React.PropTypes.func,
		canFilter: React.PropTypes.bool,
		filterCallback: React.PropTypes.func,
		filterPlaceholder: React.PropTypes.string,
		name: React.PropTypes.string,
		preserveSelectOrder: React.PropTypes.bool,
		selected: React.PropTypes.arrayOf(React.PropTypes.string),
		selectedRef: React.PropTypes.func,
	};

	static defaultProps = {
		available: undefined,
		availableRef: null,
		canFilter: false,
		filterPlaceholder: 'Search...',
		filterCallback: defaultFilter,
		name: null,
		preserveSelectOrder: null,
		selected: [],
		selectedRef: null,
	};

	/**
	 * @param {Object} props
	 *
	 * @returns {void}
	 */
	constructor(props) {
		super(props);

		this.state = {
			filter: {
				available: '',
				selected: '',
			},
		};

		this.onClick = this.onClick.bind(this);
		this.onDoubleClick = this.onDoubleClick.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);

		this.id = shortid.generate();
	}

	/**
	 * @param {string} direction
	 * @param {boolean} isMoveAll
	 *
	 * @return {void}
	 */
	onClick({ direction, isMoveAll }) {
		const { options, onChange } = this.props;
		const select = direction === 'right' ? this.available : this.selected;

		let selected = [];

		if (isMoveAll) {
			selected = direction === 'right' ? this.makeOptionsSelected(options) : [];
		} else {
			selected = this.toggleSelected(
				this.getSelectedOptions(select),
			);
		}

		onChange(selected);
	}

	/**
	 * @param {Object} event
	 *
	 * @returns {void}
	 */
	onDoubleClick(event) {
		const value = event.currentTarget.value;
		const selected = this.toggleSelected([value]);

		this.props.onChange(selected);
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onKeyUp(event) {
		const { currentTarget, key } = event;

		if (key === 'Enter') {
			const selected = this.toggleSelected(
				arrayFrom(currentTarget.options)
					.filter(option => option.selected)
					.map(option => option.value),
			);

			this.props.onChange(selected);
		}
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onFilterChange(event) {
		this.setState({
			filter: {
				...this.state.filter,
				[event.target.dataset.name]: event.target.value,
			},
		});
	}

	/**
	 * Converts a flat array to a key/value mapping.
	 *
	 * @param {Array} options
	 *
	 * @returns {Object}
	 */
	getLabelMap(options) {
		let labelMap = {};

		options.forEach((option) => {
			if (option.options !== undefined) {
				labelMap = { ...labelMap, ...this.getLabelMap(option.options) };
			} else {
				labelMap[option.value] = option.label;
			}
		});

		return labelMap;
	}

	/**
	 * Returns the selected options from a given element.
	 *
	 * @param {Object} element
	 *
	 * @returns {Array}
	 */
	getSelectedOptions(element) {
		return arrayFrom(element.options)
			.filter(option => option.selected)
			.map(option => option.value);
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

		this.filterAvailable(options).forEach((option) => {
			if (option.options !== undefined) {
				selected = [...selected, ...this.makeOptionsSelected(option.options)];
			} else {
				selected.push(option.value);
			}
		});

		return [...this.props.selected, ...selected];
	}

	/**
	 * Toggle a new set of selected elements.
	 *
	 * @param {Array} selected
	 *
	 * @returns {Array}
	 */
	toggleSelected(selected) {
		const oldSelected = this.props.selected.slice(0);

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
	 * @param {string} filterInput
	 *
	 * @returns {Array}
	 */
	filterOptions(options, filterer, filterInput) {
		const { canFilter, filterCallback } = this.props;
		const filtered = [];

		options.forEach((option) => {
			if (option.options !== undefined) {
				const children = this.filterOptions(option.options, filterer, filterInput);

				if (children.length > 0) {
					filtered.push({
						label: option.label,
						options: children,
					});
				}
			} else if (filterer(option)) {
				// Test option against filter input
				if (canFilter && !filterCallback(option, filterInput)) {
					return;
				}

				filtered.push(option);
			}
		});

		return filtered;
	}

	/**
	 * Filter the available options.
	 *
	 * @param {Array} options
	 *
	 * @returns {Array}
	 */
	filterAvailable(options) {
		if (this.props.available !== undefined) {
			return this.filterOptions(
				options,
				option => (
					this.props.available.indexOf(option.value) >= 0 &&
					this.props.selected.indexOf(option.value) < 0
				),
				this.state.filter.available,
			);
		}

		// Show all un-selected options
		return this.filterOptions(
			options,
			option => this.props.selected.indexOf(option.value) < 0,
			this.state.filter.available,
		);
	}

	/**
	 * Filter the selected options.
	 *
	 * @param {Array} options
	 *
	 * @returns {Array}
	 */
	filterSelected(options) {
		if (this.props.preserveSelectOrder) {
			return this.filterSelectedByOrder(options);
		}

		// Order the selections by the default order
		return this.filterOptions(
			options,
			option => this.props.selected.indexOf(option.value) >= 0,
			this.state.filter.selected,
		);
	}

	/**
	 * Preserve the selection order. This drops the opt-group associations.
	 *
	 * @param {Array} options
	 *
	 * @returns {Array}
	 */
	filterSelectedByOrder(options) {
		const { canFilter, filterCallback } = this.props;
		const labelMap = this.getLabelMap(options);

		const selectedOptions = this.props.selected.map(selected => ({
			value: selected,
			label: labelMap[selected],
		}));

		if (canFilter) {
			return selectedOptions.filter(
				selected => filterCallback(selected, this.state.filter.selected),
			);
		}

		return selectedOptions;
	}

	/**
	 * @param {string} key
	 * @param {Array} options
	 * @param {function} ref
	 *
	 * @returns {React.Component}
	 */
	renderSelect(key, options, ref) {
		return (
			<select
				className="rdl-control"
				id={`${this.id}-${key}`}
				multiple
				ref={(c) => {
					this[key] = c;

					if (ref) {
						ref(c);
					}
				}}
				onDoubleClick={this.onDoubleClick}
				onKeyUp={this.onKeyUp}
			>
				{options}
			</select>
		);
	}

	/**
	 * @returns {Array}
	 */
	renderOptions(options) {
		return options.map((option) => {
			const key = `${option.value}-${option.label}`;

			if (option.options !== undefined) {
				return (
					<optgroup key={key} label={option.label}>
						{this.renderOptions(option.options)}
					</optgroup>
				);
			}

			return (
				<option key={key} value={option.value}>
					{option.label}
				</option>
			);
		});
	}

	/**
	 * @param {boolean} canFilter
	 * @param {string} filterPlaceholder
	 * @param {string} name
	 *
	 * @returns {React.Component}
	 */
	renderFilter(canFilter, filterPlaceholder, name) {
		if (!canFilter) {
			return null;
		}

		return (
			<input
				className="rdl-filter"
				data-name={name}
				id={`${this.id}-filter-${name}`}
				placeholder={filterPlaceholder}
				type="text"
				value={this.state.filter[name]}
				onChange={this.onFilterChange}
			/>
		);
	}

	/**
	 * @returns {React.Component}
	 */
	render() {
		const {
			canFilter,
			filterPlaceholder,
			name,
			options,
			selected,
			availableRef,
			selectedRef,
		} = this.props;
		const availableOptions = this.renderOptions(this.filterAvailable(options));
		const selectedOptions = this.renderOptions(this.filterSelected(options));

		const className = classNames({
			'react-dual-listbox': true,
			'rdl-has-filter': canFilter,
		});

		return (
			<div className={className}>
				<div className="rdl-available">
					<label className="rdl-control-label" htmlFor={`${this.id}-filter-available`}>
						Filter Available
					</label>
					{this.renderFilter(canFilter, filterPlaceholder, 'available')}
					<label className="rdl-control-label" htmlFor={`${this.id}-available`}>
						Available
					</label>
					{this.renderSelect('available', availableOptions, availableRef)}
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
					<label className="rdl-control-label" htmlFor={`${this.id}-filter-selected`}>
						Filter Selected
					</label>
					{this.renderFilter(canFilter, filterPlaceholder, 'selected')}
					<label className="rdl-control-label" htmlFor={`${this.id}-selected`}>
						Selected
					</label>
					{this.renderSelect('selected', selectedOptions, selectedRef)}
				</div>
				<input type="hidden" name={name} value={selected} />
			</div>
		);
	}
}

export default DualListBox;
