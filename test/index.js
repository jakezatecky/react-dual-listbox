import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';

import DualListBox from '../src/js/DualListBox';

describe('<DualListBox />', () => {
	describe('component', () => {
		it('should render the react-dual-listbox container', () => {
			const wrapper = shallow(<DualListBox options={[{ label: 'Phobos', value: 'phobos' }]} onChange={() => {}} />);

			assert.isTrue(wrapper.find('.react-dual-listbox').exists());
		});
	});

	describe('props.children', () => {
		it('should render the supplied options', () => {
			const wrapper = shallow(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				onChange={() => {}}
			/>);

			assert.isTrue(wrapper.contains(<option value="luna">Moon</option>));
			assert.isTrue(wrapper.contains(<option value="phobos">Phobos</option>));
		});

		it('should render optgroups and their children', () => {
			const wrapper = shallow(<DualListBox
				options={[
					{
						label: 'Mars',
						options: [
							{ value: 'phobos', label: 'Phobos' },
							{ value: 'deimos', label: 'Deimos' },
						],
					},
				]}
				onChange={() => {}}
			/>);

			assert.isTrue(wrapper.contains((
				<optgroup label="Mars">
					<option value="phobos">Phobos</option>
					<option value="deimos">Deimos</option>
				</optgroup>
			)));
		});
	});

	describe('props.selected', () => {
		it('should render selected options', () => {
			const wrapper = shallow(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				onChange={() => {}}
				selected={['phobos']}
			/>);

			assert.isTrue(wrapper.find('.rdl-selected').contains((
				<option value="phobos">Phobos</option>
			)));
		});
	});

	describe('props.available', () => {
		it('should include options in the array in the available list', () => {
			const wrapper = shallow(<DualListBox
				available={['luna']}
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				onChange={() => {}}
			/>);

			assert.isTrue(wrapper.find('.rdl-available').contains((
				<option value="luna">Moon</option>
			)));
		});

		it('should exclude options not in the array from the available list', () => {
			const wrapper = shallow(<DualListBox
				available={['luna']}
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				onChange={() => {}}
			/>);

			assert.isFalse(wrapper.find('.rdl-available').contains((
				<option value="phobos">Phobos</option>
			)));
		});

		it('should not interfere with selected options', () => {
			const wrapper = shallow(<DualListBox
				available={['luna']}
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				selected={['luna', 'phobos']}
				onChange={() => {}}
			/>);

			assert.isTrue(wrapper.find('.rdl-selected').contains((
				<option value="luna">Moon</option>
			)));
			assert.isTrue(wrapper.find('.rdl-selected').contains((
				<option value="phobos">Phobos</option>
			)));
		});
	});

	describe('moveAllRight', () => {
		it('should call onChange with all available options selected', () => {
			let actual = null;

			const wrapper = mount(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				onChange={(selected) => {
					actual = selected;
				}}
			/>);

			wrapper.find('.rdl-btn-all.rdl-btn-right').simulate('click');

			assert.deepEqual(['luna', 'phobos'], actual);
		});
	});

	describe('moveAllLeft', () => {
		it('should call onChange with no options selected', () => {
			let actual = null;

			const wrapper = mount(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				selected={['luna', 'phobos']}
				onChange={(selected) => {
					actual = selected;
				}}
			/>);

			wrapper.find('.rdl-btn-all.rdl-btn-left').simulate('click');

			assert.deepEqual([], actual);
		});
	});
});
