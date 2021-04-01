import React from "react";
import DualListBox from "react-dual-listbox";

const options = [
    { value: "luna", label: "Moon" },
    { value: "phobos", label: "Phobos" },
    { value: "deimos", label: "Deimos" },
    { value: "io", label: "Io" },
    { value: "europa", label: "Europa" },
    { value: "ganymede", label: "Ganymede" },
    { value: "callisto", label: "Callisto" },
    { value: "mimas", label: "Mimas" },
    { value: "enceladus", label: "Enceladus" },
    { value: "tethys", label: "Tethys" },
    { value: "rhea", label: "Rhea" },
    { value: "titan", label: "Titan" },
    { value: "iapetus", label: "Iapetus" },
];

class MoveToTopAndBottomButtons extends React.Component {
    state = { selected: ["phobos", "titan"] };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(selected) {
        this.setState({ selected });
    }

    render() {
        const { selected } = this.state;

        return (
            <DualListBox
                options={options}
                showOrderButtons
                showMoveToTopAndBottomButtons
                preserveSelectOrder
                selected={selected}
                onChange={this.onChange}
            />
        );
    }
}

export default MoveToTopAndBottomButtons;
