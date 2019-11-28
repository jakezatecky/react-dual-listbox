import React from 'react';
import DualListBox from 'react-dual-listbox';

const options = [
    { value: 'luna', label: 'Moon' },
    { value: 'phobos', label: 'Phobos' },
    { value: 'deimos', label: 'Deimos' },
    { value: 'io', label: 'Io' },
    { value: 'europa', label: 'Europa' },
    { value: 'ganymede', label: 'Ganymede' },
    { value: 'callisto', label: 'Callisto' },
    { value: 'mimas', label: 'Mimas' },
    { value: 'enceladus', label: 'Enceladus' },
    { value: 'tethys', label: 'Tethys' },
    { value: 'rhea', label: 'Rhea' },
    { value: 'titan', label: 'Titan' },
    { value: 'iapetus', label: 'Iapetus' },
];

const planets = {
    earth: { name: 'Earth', moons: ['luna'] },
    mars: { name: 'Mars', moons: ['phobos', 'deimos'] },
    jupiter: { name: 'Jupiter', moons: ['io', 'europa', 'ganymede', 'callisto'] },
    saturn: { name: 'Saturn', moons: ['mimas', 'enceladus', 'tethys', 'rhea', 'titan', 'iapetus'] },
};

class RestrictAvailableExample extends React.Component {
    state = {
        planet: 'earth',
        selected: ['phobos', 'titan'],
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onPlanetChange = this.onPlanetChange.bind(this);
    }

    onChange(selected) {
        this.setState({ selected });
    }

    onPlanetChange(event) {
        const planet = event.currentTarget.value;

        this.setState({ planet });
    }

    renderPlanets() {
        const { planet: selectedPlanet } = this.state;

        return Object.keys(planets).map((planet) => (
            <label key={planet} htmlFor={planet}>
                <input
                    checked={planet === selectedPlanet}
                    id={planet}
                    name="planets"
                    type="radio"
                    value={planet}
                    onChange={this.onPlanetChange}
                />
                {planets[planet].name}
            </label>
        ));
    }

    render() {
        const { selected, planet } = this.state;

        return (
            <div className="restrict-available-container">
                <div className="moons">
                    {this.renderPlanets()}
                </div>
                <DualListBox
                    available={planets[planet].moons}
                    options={options}
                    selected={selected}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default RestrictAvailableExample;
