# CHANGELOG

## [v1.1.0](https://github.com/jakezatecky/react-dual-listbox/compare/v1.0.1...v1.1.0) (2017-05-11)

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
