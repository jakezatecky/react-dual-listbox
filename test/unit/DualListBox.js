import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';

import DualListBox from '../../src/js/DualListBox';

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

            assert.isTrue(wrapper.find('ListBox').at(0).contains((
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
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox').at(1).contains((
                <option value="luna">Moon</option>
            )));
            assert.isTrue(wrapper.find('ListBox').at(1).contains((
                <option value="phobos">Phobos</option>
            )));
        });
    });

    describe('props.availableLabel', () => {
        it('should set the label for available control to the specified value', () => {
            const wrapper = mount((
                <DualListBox
                    availableLabel="Team A"
                    options={[
                        { label: 'Moon', value: 'luna' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.equal('Team A', wrapper.find('ListBox').at(0).find('label').text());
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

        it('should do a substring filter by default', () => {
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
                    value: 'moo',
                },
            });

            assert.isTrue(wrapper.contains(<option value="luna">Moon</option>));
            assert.isFalse(wrapper.contains(<option value="phobos">Phobos</option>));
        });

        it('should not error on a substring filter that contains regex characters', () => {
            const wrapper = shallow((
                <DualListBox
                    canFilter
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

            assert.isFalse(wrapper.contains(<option value="luna">Moon</option>));
            assert.isTrue(wrapper.contains(<option value="phobos">Phobos (Mars)</option>));
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

            wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
            wrapper.find('.rdl-available select').simulate('keyup', { keyCode: 32 });

            assert.deepEqual(['phobos'], actual);

            wrapper.find('.rdl-available option[value="luna"]').first().node.selected = true;
            wrapper.find('.rdl-available select').simulate('keyup', { keyCode: 31 });

            assert.deepEqual(['luna', 'phobos'], actual);
        });
    });

    describe('props.options', () => {
        it('should render the supplied options', () => {
            const wrapper = shallow((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.contains(<option value="luna">Moon</option>));
            assert.isTrue(wrapper.contains(<option value="phobos">Phobos</option>));
        });

        it('should render optgroups and their children', () => {
            const wrapper = shallow((
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
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.contains((
                <optgroup label="Mars">
                    <option value="phobos">Phobos</option>
                    <option value="deimos">Deimos</option>
                </optgroup>
            )));
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
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['phobos']}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(wrapper.find('ListBox').at(1).contains((
                <option value="phobos">Phobos</option>
            )));
        });
    });

    describe('props.selectLabel', () => {
        it('should set the label for selected control to the specified value', () => {
            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                    ]}
                    selectedLabel="Team B"
                    onChange={() => {}}
                />
            ));

            assert.equal('Team B', wrapper.find('ListBox').at(1).find('label').text());
        });
    });

    describe('props.simpleValue', () => {
        it('should pass an array of string values by default', () => {
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

            wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
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

            wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
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

            wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
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

            wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
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

            wrapper.find('.rdl-available option[value="phobos"]').first().node.selected = true;
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
    });

    describe('moveLeft', () => {
        it('should call onChange with the newly-selected options removed', () => {
            let actual = null;

            const wrapper = mount((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['phobos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            wrapper.find('.rdl-selected option[value="phobos"]').first().node.selected = true;
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
