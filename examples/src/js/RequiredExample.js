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

class BasicExample extends React.Component {
    state = { selected: [] };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(selected) {
        this.setState({ selected });
    }

    onSubmit(event) {
        // Don't reload page
        event.preventDefault();
    }

    render() {
        const { selected } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <DualListBox
                    options={options}
                    required
                    selected={selected}
                    showRequiredMessage
                    onChange={this.onChange}
                />
                <input className="rdl-btn btn-submit" type="submit" value="Submit" />
            </form>
        );
    }
}

export default BasicExample;
