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
});
