# react-dual-listbox

[![npm](https://img.shields.io/npm/v/react-dual-listbox.svg?style=flat-square)](https://www.npmjs.com/package/react-dual-listbox)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-dual-listbox.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox)
[![devDependency Status](https://david-dm.org/jakezatecky/react-dual-listbox/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-dual-listbox#info=devDependencies)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-dual-listbox/master/LICENSE.txt)

Dual listbox for React.

**Note**: This application currently assumes Bootstrap 3 and FontAwesome
have had their respective CSS files loaded.

# Usage

Install the library:

``` shell
npm install react-dual-listbox --save
```

Then render the component:

``` javascript
import DualListBox from 'react-dual-listbox';

...

render() {
    const options = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
    ];

    return <DualListBox options={options} />;
}
```

`<optgroup>`'s are also supported:

``` javascript
render() {
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

    return <DualListBox options={options} />;
}
```
