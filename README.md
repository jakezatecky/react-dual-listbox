# react-dual-listbox

[![npm](https://img.shields.io/npm/v/react-dual-listbox.svg?style=flat-square)](https://www.npmjs.com/package/react-dual-listbox)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-dual-listbox.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox)
[![devDependency Status](https://david-dm.org/jakezatecky/react-dual-listbox/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox#info=devDependencies)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-dual-listbox/master/LICENSE.txt)

> A feature-rich dual listbox for React.

![Demo](demo.gif)

# Usage

Install the library from npm:

``` shell
npm install react-dual-listbox --save
```

> **Note**: You **must** include the [ES6 polyfill](https://babeljs.io/docs/usage/polyfill/) in your project if you want IE 11 support.

> **Note**: This library requires that [Font Awesome](http://fontawesome.io/) styles are loaded in the browser.

Then render the component (note that this is a [controlled] component):

``` javascript
import DualListBox from 'react-dual-listbox';

class Widget extends React.Component {
    constructor() {
        super();
        
        this.state = { selected: ['one'] };
        this.onChange = this.onChange.bind(this);
    }

    onChange(selected) {
        this.setState({ selected });
    }

    render() {
        const options = [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
        ];
        const { selected } = this.state;

        return <DualListBox options={options} selected={selected} onChange={this.onChange} />;
    }
}
```

`<optgroup>`'s are also supported:

``` javascript
render() {
    const options = [
        {
            label: 'Earth',
            options: [
                { value: 'luna', label: 'Moon' },
            ],
        },
        {
            label: 'Mars',
            options: [
                { value: 'phobos', label: 'Phobos' },
                { value: 'deimos', label: 'Deimos' },
            ],
        },
        {
            label: 'Jupiter (Galilean moons)',
            options: [
                { value: 'io', label: 'Io' },
                { value: 'europa', label: 'Europa' },
                { value: 'ganymede', label: 'Ganymede' },
                { value: 'callisto', label: 'Callisto' },
            ],
        },
    ];

    return <DualListBox options={options} />;
}
```

## Preserve Select Ordering

By default, `react-dual-listbox` will order any selected items according
to the order of the `options` property. There may be times in which you
wish to preserve the selection order instead. In this case, you can add
the `preserveSelectOrder` property.

**Note**: Any `<optgroup>`'s supplied will not be surfaced when preserving
the selection order.

``` javascript
render() {
    ...

    return <DualListBox options={options} preserveSelectOrder />;
}
```

## Restrict Available Options

Sometimes, it may be desirable to restrict what options are available
for selection while having selected options not present in the available
list. For example, you may have a select control above that restricts
those available options to a particular planet but still want to show
all selected moons to the right. Use the `available` property in that case.

``` javascript
render() {
    ...
    const available = ['io', 'europa', 'ganymede', 'callisto'];
    
    return <DualListBox options={options} available={available} />;
}
```

[controlled]: https://facebook.github.io/react/docs/forms.html#controlled-components
