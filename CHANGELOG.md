# CHANGELOG

## [v2.2.0](https://github.com/jakezatecky/react-dual-listbox/compare/v2.1.2...v2.2.0) (2021-06-08)

### Other

* [#136]: Add support for React 17

## [v2.1.2](https://github.com/jakezatecky/react-dual-listbox/compare/v2.1.1...v2.1.2) (2021-05-20)

### Other

* [#147]: Update lodash to resolve security vulnerability

## [v2.1.1](https://github.com/jakezatecky/react-dual-listbox/compare/v2.1.0...v2.1.1) (2021-04-04)

### Bug Fixes

* [#113]: Fix issue with `simpleValue={false}` not playing nicely with `preserveSelectOrder`
* [#116]: Fix issue where the `canFilter` would ignore optgroup labels

## [v2.1.0](https://github.com/jakezatecky/react-dual-listbox/compare/v2.0.0...v2.1.0) (2021-04-03)

### New Features

* [#80]: Add `disabled` support for elements in the `options` property
* [#87]: Add `title` support for elements in the `options` property 
* [#90]: Add `selection` argument to the `onChange` handler to track highlighted values
* [#104]: Add `className` property to allow specification of a custom class on the root node
* [#133]: Add `moveTop` and `moveBottom` buttons to `showOrderButtons` property

### Bug Fixes

* [#103]: Fix issue where `allowDuplicates` would fail to add extra items when `simpleValue={false}`
* [#110]: Fix issue where `allowDuplicates` would cause the `available` property to be ignored
* [#124]: Fix issue where the selection area would return to the top of the list after moving items with some properties

## [v2.0.0](https://github.com/jakezatecky/react-dual-listbox/compare/v1.4.2...v2.0.0) (2019-05-14)

### New Features

* [#22]: Add `showHeaderLabels` property to make labels appear above the available and selected list boxes

### Bug Fixes

* [#73]: Fix issue where a numeric `value` types would be passed as strings in the `onChange` callback

### Other

* [#61]: **(breaking)** Merge `availableLabel` and `selectedLabel` into the `lang` property and rename them to `availableHeader` and `selectedHeader`
* [#62]: Add test to ensure that Less and Sass source files generate the same compiled CSS
* [#75]: Reduce filtering computational complexity to increase performance when using a large number of options

## [v1.4.2](https://github.com/jakezatecky/react-dual-listbox/compare/v1.4.1...v1.4.2) (2018-12-21)

### Bug Fixes

* [#57]: Fix issue where clicking on the ordering buttons would result in errors if the selected list was empty
* [#58]: Fix issue where not all items marked in the selected list would be removed when the "Move left" button was clicked

## [v1.4.1](https://github.com/jakezatecky/react-dual-listbox/compare/v1.4.0...v1.4.1) (2018-12-17)

### Bug Fixes

* [#56]: Fix various PropTypes errors

## [v1.4.0](https://github.com/jakezatecky/react-dual-listbox/compare/v1.3.2...v1.4.0) (2018-12-16)

### New Features

* [#24]: Add `showOrderButtons` property to allow users to move the selected options up or down in the list
* [#43]: Add `showNoOptionsText` property to make text appear in place of available/selected list boxes when no options are present
* [#48]: Add `allowDuplicates` property to allow more than one copy of an available value to be selected
* [#50]: Add `id` property for control over the HTML ID assigned to the component instance
* [#54]: Add `lang` property for localization
* [#55]: Add `icons` property for icon customization

### Bug Fixes

* [#53]: Fix an issue where previously selected options would be duplicated when using the "Move all right" button

## [v1.3.2](https://github.com/jakezatecky/react-dual-listbox/compare/v1.3.1...v1.3.2) (2018-02-06)

### Bug Fixes

* [#35]: Fix issue where `simpleValue` would not reveal selected optgroup options
* [#36]: Fix default filtering when dealing with regular expression symbols

## [v1.3.1](https://github.com/jakezatecky/react-dual-listbox/compare/v1.3.0...v1.3.1) (2018-01-06)

### Bug Fixes

* [#33]: Fix sizing issues in IE 11 when the action buttons are aligned to the top

## [v1.3.0](https://github.com/jakezatecky/react-dual-listbox/compare/v1.2.0...v1.3.0) (2017-09-10)

### New Features

* [#27]: Add `simpleValue` property to disable the default behavior of returning an array of values rather than an array of option objects
* [#28]: Add `availableLabel` and `selectedLabel` to change the hidden control label texts
* [#30]: Add `moveKeyCodes` property to set the key codes that trigger a move for the select options

## [v1.2.0](https://github.com/jakezatecky/react-dual-listbox/compare/v1.1.0...v1.2.0) (2017-08-12)

### New Features

* [#26]: Add support for `filter` and `onFilterChange` properties

## [v1.1.0](https://github.com/jakezatecky/react-dual-listbox/compare/v1.0.1...v1.1.0) (2017-05-11)

### New Features

* [#21]: Add support for `disabled` property

## [v1.0.1](https://github.com/jakezatecky/react-dual-listbox/compare/v1.0.0...v1.0.1) (2017-04-11)

### Bug Fixes

* [#19]: Fix issue with additional border appearing between two action buttons

## [v1.0.0](https://github.com/jakezatecky/react-dual-listbox/compare/v0.6.0...v1.0.0) (2017-04-10)

### New Features

* [#6]: Search and filtering has been added with the props `canFilter`, `filterPlaceholder`, and `filterCallback`
* [#14]: Allow movement buttons to be arrange above lists using the `alignActions` prop

### Bug Fixes

* [#10]: Fix an issue where selections would shift down after moving items to the opposite list

### Other

* [#18]: Remove requirement on `Array.from` polyfill

## [v0.6.0](https://github.com/jakezatecky/react-dual-listbox/compare/v0.5.1...v0.6.0) (2017-03-25)

### New Features

* [#15]: Components are now more accessible to assistive technologies

### Other

* [#16]: **(breaking)** Rename `.rdl-btn` to `.rdl-move`
* [#17]: **(breaking)** Use color more consistently and make font-family inherit

## [v0.5.1](https://github.com/jakezatecky/react-dual-listbox/compare/v0.5.0...v0.5.1) (2017-01-12)

### New Features

* [#2]: Add support for `availableRef` and `selectedRef`

## [v0.5.0](https://github.com/jakezatecky/react-dual-listbox/compare/v0.4.0...v0.5.0) (2017-01-10)

### New Features

* [#12]: Bootstrap is no longer required for the component to display properly
* [#13]: Component styles are a bit more flexible by default

## [v0.4.0](https://github.com/jakezatecky/react-dual-listbox/compare/v0.3.4...v0.4.0) (2016-12-31)

### Bug Fixes

* [#3]: Fix an issue where events were not firing in IE 11
* [#9]: Fix an issue where flexbox styling in IE 11 was not being applied correctly

### New Features

* [#11]: Add ability to toggle selected options on pressing <kbd>Enter</kbd>

## [v0.3.4](https://github.com/jakezatecky/react-dual-listbox/compare/v0.3.3...v0.3.4) (2016-12-28)

### Bug Fixes

* [#7]: Fix an issue where clicking on the icon of a button would not trigger events properly in some browsers
