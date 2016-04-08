import React from 'react';
import ReactDOM from 'react-dom';

import DualListBox from '../src/js/DualListbox';

const options = [
	{ label: 'Earth', options: [
		{ value: 'luna', label: 'Moon' },
	] },
	{ label: 'Mars', options: [
		{ value: 'phobos', label: 'Phobos' },
		{ value: 'deimos', label: 'Deimos' },
	] },
	{ label: 'Jupiter (Galilean moons)', options: [
		{ value: 'io', label: 'Io' },
		{ value: 'europa', label: 'Europa' },
		{ value: 'ganymede', label: 'Ganymede' },
		{ value: 'callisto', label: 'Callisto' },
	] },
];

ReactDOM.render(
	<DualListBox name="moons" options={options} />,
	document.getElementById('mount')
);
