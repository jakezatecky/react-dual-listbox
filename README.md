# react-dual-listbox

[![npm](https://img.shields.io/npm/v/react-dual-listbox.svg?style=flat-square)](https://www.npmjs.com/package/react-dual-listbox)
[![Build Status](https://img.shields.io/travis/jakezatecky/react-dual-listbox/master.svg?style=flat-square)](https://travis-ci.org/jakezatecky/react-dual-listbox)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-dual-listbox.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox)
[![devDependency Status](https://david-dm.org/jakezatecky/react-dual-listbox/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox#info=devDependencies)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-dual-listbox/master/LICENSE.txt)

> A feature-rich dual listbox for React.

![Demo](demo.gif)

## Usage

### Installation

Install the library using your favorite dependency manager:

``` shell
npm install react-dual-listbox --save
```

``` shell
yarn add react-dual-listbox
```

> **Note** &ndash; This library makes use of [Font Awesome](http://fontawesome.io/) styles and expects them to be loaded in the browser.

> **Note** &ndash; If you need support for IE 11, you **must** include an `Array.from` polyfill, such as the [Babel ES6 polyfill](https://babeljs.io/docs/usage/polyfill/).

### Include CSS

For your convenience, the library's styles can be consumed utilizing one of the following files:

* `node_modules/react-dual-listbox/lib/react-dual-listbox.css`
* `node_modules/react-dual-listbox/src/less/react-dual-listbox.less`
* `node_modules/react-dual-listbox/src/sass/react-dual-listbox.scss`

Either include one of these files in your stylesheets or utilize a CSS loader:

``` javascript
import 'react-dual-listbox/lib/react-dual-listbox.css';
```

### Render Component

The `DualListBox` is a [controlled] component, so you have to update the `selected` property in conjunction with the `onChange` handler if you want the selected values to change.

Here is a minimal rendering of the component:

``` javascript
import React from 'react';
import DualListBox from 'react-dual-listbox';

...

<DualListBox
    options={[
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
    ]}
    selected={['one']}
    onChange={(selected) => {
        console.log(selected);
    }}
/>
```

### Optgroups

Traditional `<optgroup>`'s are also supported:

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

### Preserve Select Ordering

By default, `react-dual-listbox` will order any selected items according to the order of the `options` property. There may be times in which you wish to preserve the selection order instead. In this case, you can add the `preserveSelectOrder` property.

> **Note** &ndash; Any `<optgroup>`'s supplied will not be surfaced when preserving the selection order.

``` javascript
render() {
    ...

    return <DualListBox options={options} preserveSelectOrder />;
}
```

### Restrict Available Options

Sometimes, it may be desirable to restrict what options are available for selection. For example, you may have a control above the dual listbox that allows a user to search for a planet in the solar system. Once a planet is selected, you want to restrict the available options to the moons of that planet. Use the `available` property in that case.

``` javascript
render() {
    ...
    
    // Let's restrict ourselves to the Jovian moons
    const available = ['io', 'europa', 'ganymede', 'callisto'];
    
    return <DualListBox options={options} available={available} />;
}
```

[controlled]: https://facebook.github.io/react/docs/forms.html#controlled-components
