import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';

import { moons as options } from './options.js';

const planets = {
    earth: { name: 'Earth', moons: ['luna'] },
    mars: { name: 'Mars', moons: ['phobos', 'deimos'] },
    jupiter: { name: 'Jupiter', moons: ['io', 'europa', 'ganymede', 'callisto'] },
    saturn: { name: 'Saturn', moons: ['mimas', 'enceladus', 'tethys', 'rhea', 'titan', 'iapetus'] },
};

function RestrictAvailableExample() {
    const [planet, setPlanet] = useState('earth');
    const [selected, setSelected] = useState(['phobos', 'titan']);

    const onPlanetChange = (event) => {
        setPlanet(event.currentTarget.value);
    };

    const onChange = (value) => {
        setSelected(value);
    };

    function renderPlanets() {
        return Object.keys(planets).map((planetKey) => (
            <label key={planetKey} htmlFor={planetKey}>
                <input
                    checked={planetKey === planet}
                    id={planetKey}
                    name="planets"
                    type="radio"
                    value={planetKey}
                    onChange={onPlanetChange}
                />
                {planets[planetKey].name}
            </label>
        ));
    }

    return (
        <div className="restrict-available-container">
            <div className="moons">
                {renderPlanets()}
            </div>
            <DualListBox
                available={planets[planet].moons}
                id="restrict"
                options={options}
                selected={selected}
                onChange={onChange}
            />
        </div>
    );
}

export default RestrictAvailableExample;
