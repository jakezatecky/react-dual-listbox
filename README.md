# react-dual-listbox

[![npm](https://img.shields.io/npm/v/react-dual-listbox.svg?style=flat-square)](https://www.npmjs.com/package/react-dual-listbox)
[![Build Status](https://img.shields.io/travis/jakezatecky/react-dual-listbox/master.svg?style=flat-square)](https://travis-ci.org/jakezatecky/react-dual-listbox)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-dual-listbox.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox)
[![devDependency Status](https://david-dm.org/jakezatecky/react-dual-listbox/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox?type=dev)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-dual-listbox/master/LICENSE.txt)

> A feature-rich dual listbox for React.

![Demo](demo.gif)

## Usage

### Installation

Install the library using your favorite dependency manager:

``` shell
yarn add react-dual-listbox
```

Using npm:

``` shell
npm install react-dual-listbox --save
```

> **Note** &ndash; This library makes use of [Font Awesome](http://fontawesome.io/) styles and expects them to be loaded in the browser.

### Include CSS

For your convenience, the library's styles can be consumed utilizing one of the following files:

* `node_modules/react-dual-listbox/lib/react-dual-listbox.css`
* `node_modules/react-dual-listbox/src/less/react-dual-listbox.less`
* `node_modules/react-dual-listbox/src/scss/react-dual-listbox.scss`

Either include one of these files in your stylesheets or utilize a CSS loader:

``` jsx
import 'react-dual-listbox/lib/react-dual-listbox.css';
```

### Render Component

The `DualListBox` is a [controlled] component, so you have to update the `selected` property in conjunction with the `onChange` handler if you want the selected values to change.

Here is a minimal rendering of the component:

``` jsx
import React from 'react';
import DualListBox from 'react-dual-listbox';

const options = [
    { value: 'one', label: 'Option One' },
    { value: 'two', label: 'Option Two' },
];

class Widget extends React.Component {
    constructor() {
        super();

        this.state = {
            selected: ['one'],
        };
    }

    render() {
        return (
            <DualListBox
                options={options}
                selected={this.state.selected}
                onChange={(selected) => {
                    this.setState({ selected });
                }}
            />
        );
    }
}
```

### Optgroups

Traditional `<optgroup>`'s are also supported:

``` jsx
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
            label: 'Jupiter',
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

### Filtering

You can enable filtering of available and selected options by merely passing in the `canFilter` property:

``` jsx
render() {
    ...

    return <DualListBox canFilter options={options} />;
}
```

Optionally, you can also override the default filter placeholder text and the filtering function:

``` jsx
render() {
    ...

    return (
        <DualListBox
            canFilter
            filterCallback={(option, filterInput) => {
                if (filterInput === '') {
                    return true;
                }

                return (new RegExp(filterInput, 'i')).test(option.label);
            }}
            filterPlaceholder="Filter..."
            options={options}
        />
    );
}
```

In addition, you can control the filter search text, rather than leaving it up to the component:

``` jsx
render() {
    ...

    return (
        <DualListBox
            canFilter
            filter={{
                available: 'europa',
                selected: '',
            }}
            options={options}
            onFilterChange={(filter) => {
                console.log(filter;
            }}
        />
    );
}
```

### Action/Button Alignment

By default, the movement buttons are aligned to the center of the component. Another option is to align these actions to be above their respective lists:

``` jsx
render() {
    ...

    return (
        <DualListBox alignActions="top" options={options} />
    );
}
```

### Preserve Select Ordering

By default, `react-dual-listbox` will order any selected items according to the order of the `options` property. There may be times in which you wish to preserve the selection order instead. In this case, you can add the `preserveSelectOrder` property.

> **Note** &ndash; Any `<optgroup>`'s supplied will not be surfaced when preserving the selection order.

``` jsx
render() {
    ...

    return <DualListBox options={options} preserveSelectOrder />;
}
```

### Restrict Available Options

Sometimes, it may be desirable to restrict what options are available for selection. For example, you may have a control above the dual listbox that allows a user to search for a planet in the solar system. Once a planet is selected, you want to restrict the available options to the moons of that planet. Use the `available` property in that case.

``` jsx
render() {
    ...
    
    // Let's restrict ourselves to the Jovian moons
    const available = ['io', 'europa', 'ganymede', 'callisto'];
    
    return <DualListBox options={options} available={available} />;
}
```

### Changing the Default Icons

By default, **react-dual-listbox** uses Font Awesome for the various icons that appear in the component. To change the defaults, simply pass in the `icons` property and override the defaults:

``` jsx
<DualListBox
    ...
    icons={{
        moveLeft: <span className="fa fa-chevron-left" />,
        moveAllLeft: [
            <span key={0} className="fa fa-chevron-left" />,
            <span key={1} className="fa fa-chevron-left" />,
        ],
        moveRight: <span className="fa fa-chevron-right" />,
        moveAllRight: [
            <span key={0} className="fa fa-chevron-right" />,
            <span key={1} className="fa fa-chevron-right" />,
        ],
    }}
/>
```

### Other Properties

| Property       | Type   | Description                                                                                                             | Default        |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- | -------------- |
| availableLabel | string | The display name for the hidden label for the available options control group.                                          | `"Available"`  |
| disabled       | bool   | If true, both "available" and "selected" list boxes will be disabled.                                                   | `false`        |
| icons          | object | The key-value pairing of action icons and their React nodes. See **Changing the Default Icons** for further info.       | `{ ... }`      |
| id             | string | The HTML ID prefix for the various sub elements.                                                                        | `null`         |
| lang           | object | The key-value pairing of localized text. See `src/js/lang/default.js` for a list of keys.                               | `{ ... }`      |
| moveKeyCodes   | array  | The key codes that will trigger a toggle of the selected options.                                                       | `[13, 32]`     |
| selectedLabel  | string | The display name for the hidden label for the selected options control group.                                           | `"Selected"`   |
| simpleValue    | bool   | If true, the `selected` value passed in `onChange` is an array of string values. Otherwise, it is an array of options.  | `true`         |

[controlled]: https://facebook.github.io/react/docs/forms.html#controlled-components
