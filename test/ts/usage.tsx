import * as React from 'react';
import DualListBox, { DualListBoxProperties, Option } from 'react-dual-listbox';

/** Example options */
// Flat options (ValueOption<string>[])
const flatOptions = [
  { label: 'One', value: 'one' }, // ValueOption<string>
  { label: 'Two', value: 'two' }, // ValueOption<string>
];
// Nested options (Option<string>[])
const nestedOptions = [
  { label: 'Option 1', value: '1' }, // ValueOption<string>
  {
    label: 'Category',
    options: [
      { label: 'Option 2', value: '2' }, // ValueOption<string>
      {
        label: 'Nested Category',
        options: [
          { label: 'Option 3', value: '4' }, // ValueOption<string>
        ],
      }, // CategoryOption<string>
    ],
  }, // CategoryOption<string>
]; // Option<string>[]

/** Example change handlers */
// Simple value change handler.
const valuesChange = (selectedValues: string[]) => {};
// Complex value change handler.
const optionsChange = (selectedValues: Option<string>[]) => {};

/** Using flat and nested option structures. **/
<DualListBox options={flatOptions} />;
<DualListBox options={nestedOptions} />;

/** Selection examples. */
<DualListBox
  options={flatOptions}
  onChange={valuesChange}
/>;
<DualListBox
  options={flatOptions}
  simpleValue={true}
  onChange={valuesChange}
/>;
<DualListBox
  options={flatOptions}
  simpleValue={false}
  onChange={optionsChange}
/>;
/** Selection error examples. */
/*
// You can't use an options change handler when `simpleValues` is not `false`
<DualListBox
  options={flatOptions}
  onChange={optionsChange}
/>;
<DualListBox
  options={flatOptions}
  simpleValue={true}
  onChange={optionsChange}
/>;
// You can't use a values change handler when `simpleValues` is `false`
<DualListBox
  options={flatOptions}
  simpleValue={false}
  onChange={valuesChange}
/>;
*/

/** Filtering examples. */
<DualListBox
  options={flatOptions}
  canFilter={false}
/>;
<DualListBox
  options={flatOptions}
  canFilter={true}
  filter={{
    available: flatOptions.map(o => o.value),
    selected: [],
  }}
  onFilterChange={() => {}}
  filterPlaceholder={''}
  filterCallback={(option: Option<String>) => true}
/>;
/** Filtering error examples. */
/*
// You can not use filter properties when `canFilter` is not `true`:
<DualListBox
  options={flatOptions}
  filter={{
    available: flatOptions.map(o => o.value),
    selected: [],
  }}
  onFilterChange={() => {}}
  filterPlaceholder={''}
  filterCallback={(option: Option<String>) => true}
/>;
<DualListBox
  options={flatOptions}
  canFilter={false}
  filter={{
    available: flatOptions.map(o => o.value),
    selected: [],
  }}
  onFilterChange={() => {}}
  filterPlaceholder={''}
  filterCallback={(option: Option<String>) => true}
/>;
*/

/** Section labels. */
<DualListBox
  options={flatOptions}
  available={flatOptions.map(o => o.value)}
  availableLabel={'Available'}
  selectedLabel={'Selected'}
/>;

/** Action alignment. */
<DualListBox options={flatOptions} alignActions={'top'} />;

/** Ppreserving select order. */
<DualListBox options={flatOptions} preserveSelectOrder={true} />;

/** `moveKeyCodes` example. */
<DualListBox options={flatOptions} moveKeyCodes={[13, 32]} />;

/** Kitchen sink. */
<DualListBox
  options={flatOptions}
  selected={[]}
  alignActions={'top'}
  preserveSelectOrder={true}
  available={flatOptions.map(o => o.value)}
  availableLabel={'Available'}
  selectedLabel={'Selected'}
  moveKeyCodes={[13, 32]}
  simpleValue={false}
  onChange={optionsChange}
  canFilter={true}
  filter={{
    available: flatOptions.map(o => o.value),
    selected: [],
  }}
  onFilterChange={() => {}}
  filterPlaceholder={''}
  filterCallback={(option: Option<String>) => true}
/>;
