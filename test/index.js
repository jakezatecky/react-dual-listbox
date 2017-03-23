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

	describe('props.preserveSelectOrder', () => {
		it('should arrange the selected options by their original order when false', () => {
			const wrapper = shallow(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				preserveSelectOrder={false}
				selected={['phobos', 'luna']}
				onChange={() => {}}
			/>);

			assert.equal('luna', wrapper.find('.rdl-selected option').at(0).prop('value'));
			assert.equal('phobos', wrapper.find('.rdl-selected option').at(1).prop('value'));
		});

		it('should arrange the selected options by their selection order when true', () => {
			const wrapper = shallow(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				preserveSelectOrder
				selected={['phobos', 'luna']}
				onChange={() => {}}
			/>);

			assert.equal('phobos', wrapper.find('.rdl-selected option').at(0).prop('value'));
			assert.equal('luna', wrapper.find('.rdl-selected option').at(1).prop('value'));
		});
	});

	describe('moveRight', () => {
		it('should call onChange with the newly-selected options', () => {
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

			wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
			wrapper.find('.rdl-move-right').not('.rdl-move-all').simulate('click');

			assert.deepEqual(['phobos'], actual);
		});

		it('should persist previously-selected values', () => {
			let actual = null;

			const wrapper = mount(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
					{ label: 'Deimos', value: 'deimos' },
				]}
				selected={['deimos']}
				onChange={(selected) => {
					actual = selected;
				}}
			/>);

			wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
			wrapper.find('.rdl-move-right').not('.rdl-move-all').simulate('click');

			assert.deepEqual(['deimos', 'phobos'], actual);
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

			wrapper.find('.rdl-move-all.rdl-move-right').simulate('click');

			assert.deepEqual(['luna', 'phobos'], actual);
		});
	});

	describe('moveLeft', () => {
		it('should call onChange with the newly-selected options removed', () => {
			let actual = null;

			const wrapper = mount(<DualListBox
				options={[
					{ label: 'Moon', value: 'luna' },
					{ label: 'Phobos', value: 'phobos' },
				]}
				onChange={(selected) => {
					actual = selected;
				}}
				selected={['phobos']}
			/>);

			wrapper.find('.rdl-selected option[value="phobos"]').first().node.selected = true;
			wrapper.find('.rdl-move-left').not('.rdl-move-all').simulate('click');

			assert.deepEqual([], actual);
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

			wrapper.find('.rdl-move-all.rdl-move-left').simulate('click');

			assert.deepEqual([], actual);
		});
	});
});
