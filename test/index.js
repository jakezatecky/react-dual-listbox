import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import DualListBox from '../src/js/DualListBox';

describe('<DualListBox />', () => {
	it('should render the react-dual-listbox container', () => {
		const wrapper = shallow(<DualListBox options={[{ label: 'Phobos', value: 'phobos' }]} onChange={() => {}} />);

		assert.isTrue(wrapper.find('.react-dual-listbox').exists());
	});

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
