# Changelog

## [6.0.0](https://github.com/jakezatecky/react-dual-listbox/compare/v5.0.2...v6.0.0) (2023-12-06)

_This new version includes a variety of breaking changes. Please review them before upgrading._

### Added

* Add `getOptionLabel` and `getOptionValue` properties to allow for custom keys beyond `label` and `value` (#208)
* Add `LazyFilterExample.jsx` to demonstrate lazy loading for the `options` property by user search

### Changed

* **Breaking:** `onChange` property: the second argument now returns objects with `label`, `index`, and `value`, instead of just values (#230)
* **Breaking:** `icons` property:
  * Will now merge any missing keys with the default icons
  * Rename `moveLeft`, `moveAllLeft`, `moveRight`, and `moveAllRight` to `moveToAvailable`, `moveAllToAvailable`, `moveToSelected`, and `moveAllToSelected`
* **Breaking:** `iconsClass` property: now defaults to `'fa6'`
* **Breaking:** `id` property: no longer defaults to a random UUID when null and no longer used for some child components
* **Breaking:** `lang` property:
  * Will now merge any missing keys with the default language
  * Rename `moveLeft`, `moveAllLeft`, `moveRight`, and `moveAllRight` to `moveToAvailable`, `moveAllToAvailable`, `moveToSelected`, and `moveAllToSelected`
  * Split `filterPlaceholder` into `availableFilterPlaceholder` and `selectedFilterPlaceholder`
* **Breaking:** `options` property: no longer has PropTypes validation for `label` and `value` (#208)
* **Breaking:** Rename `*-right` and `*-left` classes to `*-to-selected` and `*-to-available`
* Improve accessibility of required error
* Change filter input to `type="search"` (#247)

### Removed

* **Breaking:** Drop support for Less.js styles
* **Breaking:** Drop support for React before v16.8
* **Breaking:** Remove `rdl-sr-only` class
* Drop usage of deprecated `defaultProps` (#248)

### Fixed

* Fix positioning of action buttons relative to the list boxes
* Prevent situation where double-clicking an `optgroup` moved any selected options under it

### `icons` and `lang` Migration Guide

The keys `moveLeft`, `moveAllLeft`, `moveRight`, and `moveAllRight` are now `moveToAvailable`, `moveAllToAvailable`, `moveToSelected`, and `moveAllToSelected` in all instances. Refer to the table below to rename any affected `icons` or `lang` keys:

| Old Key Name   | New Key Name         |
| -------------- | -------------------- |
| `moveLeft`     | `moveToAvailable`    |
| `moveAllLeft`  | `moveAllToAvailable` |
| `moveRight`    | `moveToSelected`     |
| `moveAllRight` | `moveAllToSelected`  |

### Other

## [v5.0.2](https://github.com/jakezatecky/react-dual-listbox/compare/v5.0.1...v5.0.2) (2023-02-08)

### Bug Fixes

* [#217]: Fix issue where re-arrangement of an element would cause it to lose its selection status
* Make Chrome and Firefox have the same styles when an input is active

## [v5.0.1](https://github.com/jakezatecky/react-dual-listbox/compare/v5.0.0...v5.0.1) (2023-01-26)

### Bug Fixes

* Fix issues with loading stylesheets due to `exports` conflicts
* Fix default imports (you can still import `./src/index.js` provided you have a Babel loader)

## [v5.0.0](https://github.com/jakezatecky/react-dual-listbox/compare/v4.0.0...v5.0.0) (2023-01-26)

### Breaking Changes

* No longer minify bundled JavaScript (up to users to do so)

### Bug Fixes

* [#215]: Fix issue where the control height would not scale with parent

## [v4.0.0](https://github.com/jakezatecky/react-dual-listbox/compare/v3.0.1...v4.0.0) (2022-12-08)

### Breaking Changes

* Replace `moveKeyCode` property with `moveKeys` (use [keyboard keys](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) instead)
* Merge `filterPlaceholder` property into `lang` property (see [`src/lang/default.js`](https://github.com/jakezatecky/react-dual-listbox/blob/master/src/js/lang/default.js))
* Drop `arrayFrom` ["ponyfill"](https://github.com/sindresorhus/ponyfill) and rely on `array.from` (causes problems with IE11, which is [end-of-life](https://blogs.windows.com/windowsexperience/2022/06/15/internet-explorer-11-has-retired-and-is-officially-out-of-support-what-you-need-to-know/))

### New Features

* [#52]: Add `required` property

### Bug Fixes

* Fix small border radius issues when `alignActions="top"`
* Force Firefox to make input borders transparent when focus received (like Chrome)

## [v3.0.1](https://github.com/jakezatecky/react-dual-listbox/compare/v3.0.0...v3.0.1) (2022-10-28)

### Bug Fixes

* [#139]: Fix issue where selections would persist after moving options

### Other

* Increase performance when `simpleValue={false}`

## [v3.0.0](https://github.com/jakezatecky/react-dual-listbox/compare/v2.3.0...v3.0.0) (2022-10-24)

### New Features

* [#76]: **(breaking)** Add `htmlDir` property to support RTL languages (defaults to LTR)
* [#146]: Add styles for small viewport devices (<576px)
* [#203]: Add `controlKey` to the `onChange` function such that developers may identify which control triggered the change
* [#209]: **(breaking)** Add `iconsClass`, make icons more semantic, and support Unicode icons

### Bug Fixes

* [#142]: Fix issue where `preserveSelectOrder` could result in the improper removal of selected values when filtering
* [#148]: Fix issue where the "Move All" actions ignored individual `disabled` status

## [v2.3.0](https://github.com/jakezatecky/react-dual-listbox/compare/v2.2.0...v2.3.0) (2022-09-06)

### Other

* [#196]: Add React 18 to the peer dependency (**Note**: React 18 is not part of the automatic testing, but should work)

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
