import * as React from 'react';

/** A value-based option. */
export interface ValueOption<T> {
  /** The option label. */
  label: string;
  /** The option value. */
  value: T;
}

/** A category with other categories and values. */
export interface CategoryOption<T> {
  /** The category label. */
  label: string;
  /** The category child options. */
  options: Option<T>[];
}

/** Valid options include values and categories. */
export type Option<T> = ValueOption<T> | CategoryOption<T>;

/** A filter. */
export interface Filter<T> {
  /** Available options. */
  available: T[];
  /** Selected options. */
  selected: T[];
}

/** Properties common to every `DualListBox`. */
export interface CommonProperties<T> {
  /**
   * Available options.
   *
   * @example
   * const options = [
   *   { value: 'one', label: 'One'},
   *   { value: 'two', label: 'Two'},
   * ];
   * <DualListBox options={options} />
   */
  options: Option<T>[];
  /**
   * Selected options.
   *
   * @example
   * <DualListBox options={options} selected={['one']} />
   */
  selected?: T[];
  /**
   * Override the default center alignment of action buttons.
   *
   * @default "center"
   *
   * @example
   * <DualListBox options={options} alignActions="top" />
   */
  alignActions?: 'top' | 'center';
  /**
   * This flag will preserve the selection order.  By default, `react-dual-listbox`
   * orders selected items according to the order of the `options` property.
   *
   * @example
   * <DualListBox options={options} preserveSelectOrder={true} />
   */
  preserveSelectOrder?: boolean;
  /**
   * Restrict available options.
   *
   * @example
   * const available = ['io', 'europa', 'ganymede', 'callisto'];
   * <DualListBox options={options} available={available} />;
   */
  available?: T[];
  /**
   * The display name for the hidden label for the available options control group.
   *
   * @default "Available"
   *
   * @example
   * <DualListBox
   *   options={options}
   *   available={available}
   *   availableLabel="Available"
   * />;
   */
  availableLabel?: string;
  /**
   * The key codes that will trigger a toggle of the selected options.
   *
   * @default [13, 32]
   *
   * @example
   * <DualListBox options={options} moveKeyCodes={[13, 32]} />
   */
  moveKeyCodes?: number[];
  /**
   * The display name for the hidden label for the selected options control group.
   *
   * @default "Selected"
   *
   * @example
   * <DualListBox options={options} selected="Selected" />
   */
  selectedLabel?: string;
}

/** Additional `DualListBox` properties with filter. */
export interface FilterProperties<T, F extends boolean> {
  /**
   * Flag that determines whether filtering is enabled.
   *
   * @default false
   *
   * @example
   * <DualListBox options={options} canFilter={true} />
   */
  canFilter?: F;
  /**
   * Override the default filtering function.
   *
   * @example
   * <DualListBox
   *   options={options}
   *   canFilter={true}
   *   filterCallback={(option, filterInput) => !!(...)}
   * />
   */
  filterCallback?: F extends true ? ((option: Option<T>, filterInput: string) => boolean) : void;
  /**
   * Override the default filter placeholder.
   *
   * @example
   * <DualListBox
   *   options={options}
   *   canFilter={true}
   *   filterPlaceholder="..."
   * />
   */
  filterPlaceholder?: F extends true ? string : void;
  /**
   * Control the filter search text.
   *
   * @example
   * const filter = { available: 'europa', selected: '' };
   * <DualListBox
   *   options={options}
   *   canFilter={true}
   *   filter={filter}
   * />
   */
  filter?: Filter<T>;
  /**
   * Handle filter change.
   *
   * @example
   * <DualListBox
   *   options={options}
   *   canFilter={true}
   *   onFilterChange={filter => {...}}
   * />
   */
  onFilterChange?: F extends true ? ((filter: string) => void) : void;
}

/** Additional `DualListBox` properties with complex selected values. */
export interface ValueProperties<T, V extends boolean> {
  /**
   * Handle selection changes.
   *
   * @example
   * <DualListBox options={options} onChange={selected => {...}} />
   */
  // onChange?: (selected: (T | Option<T>)[]) => void;
  onChange?: (selected: (V extends true ? T[] : Option<T>[])) => void;
  /**
   * If true, the selected value passed in onChange is an array of string values.
   * Otherwise, it is an array of options.
   *
   * @default true
   *
   * @example
   * <DualListBox
   *   options={options}
   *   onChange={selectedValues => {...}}
   * />
   * <DualListBox
   *   options={options}
   *   simpleValue={false}
   *   onChange={selectedOptions => {...}}
   * />
   */
  simpleValue?: V;
}

/** `DualListBox` component properties. */
// export type DualListBoxProperties<P> = CommonProperties<P> & FilterProperties<P> & ValueProperties<P>;
interface DualListBoxProperties<P, F extends boolean, V extends boolean> extends CommonProperties<P>, FilterProperties<P, F>, ValueProperties<P, V> {}

/**
 * A feature-rich dual list box for `React`.
 *
 * The `DualListBox` is a controlled component, so you have to update the
 * `selected` property in conjunction with the `onChange` handler if you
 * want the selected values to change.
 *
 * @example
 * // Example options (Option<string>[]).
 * const options = [
 *   { label: 'One', value: 'one' },
 *   { label: 'Two', value: 'two' },
 * ];
 *
 * // Component state definition
 * interface MinimalComponentState { selectedValues: string[]; }
 * state: MinimalComponentState = { selectedValues: [] };
 *
 * // Component handler
 * handleChange = (selectedValues: string[]) =>
 *   this.setState({ selectedValues });
 *
 * // Usage example (`DualListBox` with options of
 * // `Options<string>[]` is a `DualListBox<string>`):
 * <DualListBox
 *   options={options}
 *   selected={this.state.selectedValues}
 *   onChange={this.handleChange}
 * />
 */
export default class DualListBox<P, F extends boolean = false, V extends boolean = true> extends React.Component<DualListBoxProperties<P, F, V>> {}
