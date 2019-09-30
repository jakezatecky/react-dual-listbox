import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';

import DualListBox from '../src/js/DualListBox';

const testId = 'test-id';

function simulateChange(values) {
    return {
        target: {
            options: values.map(value => ({ value, selected: true })),
        },
    };
}

function getExpectedId(rest) {
    return `${testId}-${rest}`;
}

describe('<DualListBox />', () => {
    describe('component', () => {
        it('should render the react-dual-listbox container', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('.react-dual-listbox').exists());
        });
    });

    describe('props.alignActions', () => {
        it('should align the actions in the middle by default', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('.rdl-actions > .rdl-actions-right > Action').exists());
            assert.isTrue(wrapper.find('.rdl-actions > .rdl-actions-right > Action[isMoveAll]').exists());
            assert.isTrue(wrapper.find('.rdl-actions > .rdl-actions-left > Action').exists());
            assert.isTrue(wrapper.find('.rdl-actions > .rdl-actions-left > Action[isMoveAll]').exists());
        });

        it('should put the actions in the listbox when set to \'top\'', () => {
            const wrapper = shallow((
                <DualListBox
                    alignActions="top"
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isFalse(wrapper.find('.rdl-actions').exists());
            assert.isTrue(wrapper.find('ListBox').at(0).prop('actions') !== null);
            assert.isTrue(wrapper.find('ListBox').at(1).prop('actions') !== null);
        });
    });

    describe('props.allowDuplicates', () => {
        it('should allow repeated selections of the same option when set to true', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    allowDuplicates
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos-1']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual(['luna', 'phobos', 'phobos'], actual);
        });

        it('should NOT allow repeated selections of the same option when set to false', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos-1']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual(['luna', 'phobos'], actual);
        });
    });

    describe('props.available', () => {
        it('should include options in the array in the available list', () => {
            const wrapper = shallow((
                <DualListBox
                    available={['luna']}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox').at(0).containsMatchingElement((
                <option value="luna">Moon</option>
            )));
        });

        it('should exclude options not in the array from the available list', () => {
            const wrapper = shallow((
                <DualListBox
                    available={['luna']}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isFalse(wrapper.find('ListBox').at(0).contains((
                <option value="phobos">Phobos</option>
            )));
        });

        it('should not interfere with selected options', () => {
            const wrapper = shallow((
                <DualListBox
                    available={['luna']}
                    id={testId}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox').at(1).containsMatchingElement((
                <option value="luna">Moon</option>
            )));
            assert.isTrue(wrapper.find('ListBox').at(1).containsMatchingElement((
                <option value="phobos">Phobos</option>
            )));
        });
    });

    describe('props.canFilter', () => {
        it('should render the available and selected filter inputs', () => {
            const wrapper = shallow((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox').at(0).prop('canFilter'));
            assert.isTrue(wrapper.find('ListBox').at(1).prop('canFilter'));
        });

        it('should filter available and selected options when non-empty', () => {
            const wrapper = shallow((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            wrapper.find('ListBox').at(0).simulate('filterChange', {
                target: {
                    dataset: { key: 'available' },
                    value: 'mo',
                },
            });

            assert.isTrue(wrapper.find('ListBox[controlKey="available"] option[value="luna"]').exists());
            assert.isFalse(wrapper.find('ListBox[controlKey="available"] option[value="phobos"]').exists());
        });
    });

    describe('props.disabled', () => {
        it('should assign the disabled property to all inputs, selects, and buttons when true', () => {
            const wrapper = shallow((
                <DualListBox
                    disabled
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('Action').at(0).prop('disabled'));
            assert.isTrue(wrapper.find('Action').at(1).prop('disabled'));
            assert.isTrue(wrapper.find('ListBox').at(0).prop('disabled'));
            assert.isTrue(wrapper.find('ListBox').at(1).prop('disabled'));
        });

        it('should NOT assign the disabled property to all inputs, selects, and buttons when false', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            assert.isFalse(wrapper.find('Action').at(0).prop('disabled'));
            assert.isFalse(wrapper.find('Action').at(1).prop('disabled'));
            assert.isFalse(wrapper.find('ListBox').at(0).prop('disabled'));
            assert.isFalse(wrapper.find('ListBox').at(1).prop('disabled'));
        });
    });

    describe('props.filter', () => {
        it('should set the value of the filter text boxes', () => {
            const wrapper = shallow((
                <DualListBox
                    filter={{
                        available: 'pho',
                        selected: 'europa',
                    }}
                    options={[
                        { label: 'Phobos', value: 'phobos' },
                        { label: 'Europa', value: 'europa' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.equal('pho', wrapper.find('ListBox').at(0).prop('filterValue'));
            assert.equal('europa', wrapper.find('ListBox').at(1).prop('filterValue'));
        });

        it('should update the filter value on subsequent property change', () => {
            const wrapper = shallow((
                <DualListBox
                    filter={{
                        available: 'ganymede',
                        selected: '',
                    }}
                    options={[
                        { label: 'Phobos', value: 'phobos' },
                        { label: 'Europa', value: 'europa' },
                    ]}
                    onChange={() => {}}
                />
            ));

            wrapper.setProps({
                filter: {
                    available: 'europa',
                    selected: '',
                },
            });

            assert.equal('europa', wrapper.find('ListBox').at(0).prop('filterValue'));
        });

        it('should do a substring filter by default', () => {
            const wrapper = shallow((
                <DualListBox
                    canFilter
                    id={testId}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            wrapper.find('ListBox').at(0).simulate('filterChange', {
                target: {
                    dataset: { key: 'available' },
                    value: 'moo',
                },
            });

            assert.isTrue(wrapper.containsMatchingElement(<option value="luna">Moon</option>));
            assert.isFalse(wrapper.containsMatchingElement(<option value="phobos">Phobos</option>));
        });

        it('should not error on a substring filter that contains regex characters', () => {
            const wrapper = shallow((
                <DualListBox
                    canFilter
                    id={testId}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos (Mars)', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            wrapper.find('ListBox').at(0).simulate('filterChange', {
                target: {
                    dataset: { key: 'available' },
                    value: '(mars',
                },
            });

            assert.isFalse(wrapper.containsMatchingElement(<option value="luna">Moon</option>));
            assert.isTrue(wrapper.containsMatchingElement(<option value="phobos">Phobos (Mars)</option>));
        });
    });

    describe('props.filterCallback', () => {
        it('should invoke the filterCallback function with the available options', () => {
            let available = [];

            const wrapper = shallow((
                <DualListBox
                    canFilter
                    filterCallback={(option) => {
                        available.push(option.value);
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            // Initial render
            assert.deepEqual(['luna', 'phobos'], available);

            // Clear for subsequent re-render
            available = [];
            wrapper.find('ListBox').at(0).simulate('filterChange', {
                target: {
                    dataset: { key: 'available' },
                    value: 'mo',
                },
            });

            assert.deepEqual(['luna', 'phobos'], available);
        });

        it('should invoke the filterCallback function with the input string', () => {
            let filterInput = '';

            const wrapper = shallow((
                <DualListBox
                    canFilter
                    filterCallback={(option, input) => {
                        filterInput = input;
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            wrapper.find('ListBox').at(0).simulate('filterChange', {
                target: {
                    dataset: { key: 'available' },
                    value: 'mo',
                },
            });

            assert.deepEqual('mo', filterInput);
        });
    });

    describe('props.filterPlaceholder', () => {
        it('should set the placeholder text on the filter inputs', () => {
            const wrapper = shallow((
                <DualListBox
                    canFilter
                    filterPlaceholder="Filter"
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.equal('Filter', wrapper.find('ListBox').at(0).prop('filterPlaceholder'));
        });
    });

    describe('props.icons', () => {
        it('should overwrite the default nodes for any given action', () => {
            const wrapper = mount((
                <DualListBox
                    icons={{
                        moveLeft: <span />,
                        moveAllLeft: <span />,
                        moveRight: <span />,
                        moveAllRight: <span className="new-icon" />,
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('.rdl-move-all').filter('.rdl-move-right').contains(
                <span className="new-icon" />,
            ));
        });
    });

    describe('props.id', () => {
        it('should pass the id for all elements', () => {
            const id = 'test-id';

            const wrapper = mount((
                <DualListBox
                    id={id}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find(`#${id}-option-luna`).exists());
        });
    });

    describe('props.lang', () => {
        it('should overwrite the default text when set', () => {
            const wrapper = mount((
                <DualListBox
                    lang={{
                        moveLeft: '',
                        moveAllLeft: '',
                        moveRight: '',
                        moveAllRight: 'MOVE.ALL.RIGHT',
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.equal('MOVE.ALL.RIGHT', wrapper.find('.rdl-move-all').filter('.rdl-move-right').prop('title'));
        });
    });

    describe('props.moveKeyCodes', () => {
        it('should pass an array of string values by default', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    moveKeyCodes={[31, 32]}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-available select').simulate('keyup', { keyCode: 32 });

            assert.deepEqual(['phobos'], actual);

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['luna', 'phobos']));
            wrapper.find('.rdl-available select').simulate('keyup', { keyCode: 31 });

            assert.deepEqual(['luna', 'phobos'], actual);
        });
    });

    describe('props.options', () => {
        it('should render the supplied options', () => {
            const wrapper = shallow((
                <DualListBox
                    id={testId}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.containsMatchingElement(<option value="luna">Moon</option>));
            assert.isTrue(wrapper.containsMatchingElement(<option value="phobos">Phobos</option>));
        });

        it('should render optgroups and their children', () => {
            const wrapper = shallow((
                <DualListBox
                    id={testId}
                    options={[
                        {
                            label: 'Mars',
                            options: [
                                { value: 'phobos', label: 'Phobos' },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.contains((
                <optgroup id={getExpectedId('optgroup-Mars')} label="Mars">
                    <option data-real-value={'"phobos"'} id={getExpectedId('option-phobos')} value="phobos">Phobos</option>
                    <option data-real-value={'"deimos"'} id={getExpectedId('option-deimos')} value="deimos">Deimos</option>
                </optgroup>
            )));
        });

        it('should disable marked options and optgroups', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        {
                            label: 'Mars',
                            disabled: true,
                            options: [
                                { value: 'phobos', label: 'Phobos', disabled: true },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox[controlKey="available"] optgroup').prop('disabled'));
            assert.isTrue(wrapper.find('ListBox[controlKey="available"] option').at(0).prop('disabled'));
            assert.equal(undefined, wrapper.find('ListBox[controlKey="available"] option').at(1).prop('disabled'));
        });

        it('should add the `title` attribute to specified options', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        {
                            label: 'Mars',
                            title: 'That one planet we may someday colonize',
                            options: [
                                { value: 'phobos', label: 'Phobos', title: 'The larger one' },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.equal('That one planet we may someday colonize', wrapper.find('ListBox[controlKey="available"] optgroup').prop('title'));
            assert.equal('The larger one', wrapper.find('ListBox[controlKey="available"] option').at(0).prop('title'));
            assert.equal(undefined, wrapper.find('ListBox[controlKey="available"] option').at(1).prop('title'));
        });
    });

    describe('props.preserveSelectOrder', () => {
        it('should arrange the selected options by their original order when false', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    preserveSelectOrder={false}
                    selected={['phobos', 'luna']}
                    onChange={() => {}}
                />
            ));

            assert.deepEqual('luna', wrapper.find('ListBox[controlKey="selected"] option').at(0).prop('value'));
            assert.deepEqual('phobos', wrapper.find('ListBox[controlKey="selected"] option').at(1).prop('value'));
        });

        it('should arrange the selected options by their selection order when true', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    preserveSelectOrder
                    selected={['phobos', 'luna']}
                    onChange={() => {}}
                />
            ));

            assert.deepEqual('phobos', wrapper.find('ListBox[controlKey="selected"] option').at(0).prop('value'));
            assert.deepEqual('luna', wrapper.find('ListBox[controlKey="selected"] option').at(1).prop('value'));
        });
    });

    describe('props.selected', () => {
        it('should render selected options', () => {
            const wrapper = shallow((
                <DualListBox
                    id={testId}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['phobos']}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox').at(1).containsMatchingElement((
                <option value="phobos">Phobos</option>
            )));
        });
    });

    describe('props.showHeaderLabels', () => {
        it('should make the labels above the list boxes appear when set to true', () => {
            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                    ]}
                    showHeaderLabels
                    onChange={() => {}}
                />
            ));

            const controlLabel = wrapper.find('.rdl-control-label').at(0);
            assert.isTrue(controlLabel.exists() && !controlLabel.hasClass('rdl-sr-only'));
        });

        it('should hide the labels above the list boxes when set to false', () => {
            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                    ]}
                    showHeaderLabels={false}
                    onChange={() => {}}
                />
            ));

            const controlLabel = wrapper.find('.rdl-control-label').at(0);
            assert.isTrue(controlLabel.exists() && controlLabel.hasClass('rdl-sr-only'));
        });
    });

    describe('props.showNoOptionsText', () => {
        it('should render text in place of available/selected list boxes when no options are present', () => {
            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                    ]}
                    showNoOptionsText
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('.rdl-selected .rdl-no-options').exists());
        });
    });

    describe('props.showOrderButtons', () => {
        it('should render the up and down action buttons', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    showOrderButtons
                    onChange={() => {}}
                />
            ));

            assert.equal('up', wrapper.find('Action').at(4).prop('direction'));
            assert.equal('down', wrapper.find('Action').at(5).prop('direction'));
        });

        it('should move a single item up or down when the respective button is clicked', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos', 'io']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-selected select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-move-up').simulate('click');

            assert.deepEqual(['phobos', 'luna', 'deimos', 'io'], actual);

            wrapper.find('.rdl-selected select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-move-down').simulate('click');

            // Since we actually did not change the selected order, the down action is applied on
            // the original selected order
            assert.deepEqual(['luna', 'deimos', 'phobos', 'io'], actual);
        });

        it('should move non-adjacent marked items such that they maintain their separation', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos', 'io']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-selected select').simulate('change', simulateChange(['phobos', 'io']));
            wrapper.find('.rdl-move-up').simulate('click');

            assert.deepEqual(['phobos', 'luna', 'io', 'deimos'], actual);
        });

        it('should move adjacent items together, pushing the next non-marked item up or down', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos', 'io']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-selected select').simulate('change', simulateChange(['phobos', 'deimos']));
            wrapper.find('.rdl-move-up').simulate('click');

            assert.deepEqual(['phobos', 'deimos', 'luna', 'io'], actual);
        });

        it('should not change the order of items that are already at the top or bottom', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos', 'io']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-selected select').simulate('change', simulateChange(['luna', 'phobos']));
            wrapper.find('.rdl-move-up').simulate('click');

            assert.deepEqual(['luna', 'phobos', 'deimos', 'io'], actual);
        });

        it('should preserve the order if nothing is marked', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos', 'io']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-move-up').simulate('click');

            assert.deepEqual(['luna', 'phobos', 'deimos', 'io'], actual);
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/57
        it('should not error when nothing is in the selected list', () => {
            const wrapper = mount((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={[]}
                    showOrderButtons
                    onChange={() => {}}
                />
            ));

            wrapper.find('.rdl-move-up').simulate('click');
        });
    });

    describe('props.simpleValue', () => {
        it('should pass an array of values by default', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual(['phobos'], actual);
        });

        it('should pass an array of options when false', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    simpleValue={false}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual([{
                label: 'Phobos',
                value: 'phobos',
            }], actual);
        });

        it('should also pass optgroups when false', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        {
                            label: 'Mars',
                            options: [
                                { value: 'phobos', label: 'Phobos' },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                    ]}
                    simpleValue={false}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual([{
                label: 'Mars',
                options: [{
                    label: 'Phobos',
                    value: 'phobos',
                }],
            }], actual);
        });
    });

    describe('props.onChange', () => {
        it('should pass all options in the selected listbox after a change', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual(['phobos'], actual);
        });

        it('should preserve previous selections', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual(['luna', 'phobos'], actual);
        });

        it('should handle numeric and string values', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Option 1', value: 'one' },
                        { label: 'Option 2', value: 2 },
                    ]}
                    selected={['one']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange([2]));
            wrapper.find('.rdl-available select').simulate('dblclick');

            assert.deepEqual(['one', 2], actual);
        });
    });

    describe('props.onFilterChange', () => {
        it('should be called with the updated filter value', () => {
            let filter = {
                available: '',
                selected: '',
            };

            const wrapper = shallow((
                <DualListBox
                    filter={filter}
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                    onFilterChange={(newFilter) => {
                        filter = newFilter;
                    }}
                />
            ));

            wrapper.find('ListBox').at(0).simulate('filterChange', {
                target: {
                    dataset: { key: 'available' },
                    value: 'pho',
                },
            });

            assert.deepEqual({
                available: 'pho',
                selected: '',
            }, filter);
        });
    });

    describe('moveRight', () => {
        it('should call onChange with the newly-selected options', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-move-right').not('.rdl-move-all').simulate('click');

            assert.deepEqual(['phobos'], actual);
        });

        it('should persist previously-selected values', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                        { label: 'Deimos', value: 'deimos' },
                    ]}
                    selected={['deimos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-available select').simulate('change', simulateChange(['phobos']));
            wrapper.find('.rdl-move-right').not('.rdl-move-all').simulate('click');

            assert.deepEqual(['deimos', 'phobos'], actual);
        });
    });

    describe('moveAllRight', () => {
        it('should call onChange with all available options selected', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-move-all.rdl-move-right').simulate('click');

            assert.deepEqual(['luna', 'phobos'], actual);
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/53
        it('should not duplicate any existing selections', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        {
                            label: 'Mars',
                            options: [
                                { value: 'phobos', label: 'Phobos' },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                    ]}
                    selected={['phobos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-move-all.rdl-move-right').simulate('click');

            assert.deepEqual(['phobos', 'deimos'], actual);
        });
    });

    describe('moveLeft', () => {
        it('should call onChange with the newly-selected options removed', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                        { label: 'Deimos', value: 'deimos' },
                    ]}
                    selected={['phobos', 'deimos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-selected select').simulate('change', simulateChange(['phobos', 'deimos']));
            wrapper.find('.rdl-move-left').not('.rdl-move-all').simulate('click');

            assert.deepEqual([], actual);
        });
    });

    describe('moveAllLeft', () => {
        it('should call onChange with no options selected', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-move-all.rdl-move-left').simulate('click');

            assert.deepEqual([], actual);
        });
    });
});
