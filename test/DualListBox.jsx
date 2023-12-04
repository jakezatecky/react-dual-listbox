import { render, screen } from '@testing-library/react';
import { configure, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import React from 'react';

import DualListBox from '../src';

const testId = 'test-id';

// Increase waitFor timeout to prevent unusual issues when there are many tests
configure({
    asyncUtilTimeout: 10000,
});

function setup(jsx) {
    return {
        ...render(jsx),
        user: userEvent.setup(),
    };
}

describe('<DualListBox />', async () => {
    describe('component', () => {
        it('should render the react-dual-listbox container', () => {
            const { container } = render((
                <DualListBox
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(container.querySelector('.react-dual-listbox'));
        });
    });

    describe('props.alignActions', () => {
        it('should align the actions in the middle by default', () => {
            const { container } = render((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const { children } = container.querySelector('.rdl-controls');
            assert.isTrue(children[1].classList.contains('rdl-actions'));
        });

        it('should put the actions in the listbox when set to "top"', () => {
            const { container } = render((
                <DualListBox
                    alignActions="top"
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const controls = container.querySelectorAll('.rdl-control-container');
            assert.isNull(container.querySelector('.rdl-actions'));
            assert.isNotNull(controls[0].querySelector('.rdl-actions-to-selected'));
            assert.isNotNull(controls[1].querySelector('.rdl-actions-to-available'));
        });
    });

    describe('props.allowDuplicates', () => {
        it('should allow repeated selections of the same option when set to true', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Available');
            await user.selectOptions(select, ['Phobos']);
            await user.dblClick(select);

            assert.deepEqual(actual, ['luna', 'phobos', 'phobos']);
        });

        it('should NOT allow repeated selections of the same option when set to false', () => {
            render((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['phobos']}
                    onChange={() => {}}
                />
            ));

            const select = screen.getByLabelText('Available');
            assert.isNull(within(select).queryByText('Phobos'));
        });
    });

    describe('props.available', () => {
        it('should include options in the array in the available list', () => {
            render((
                <DualListBox
                    available={['luna']}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const select = screen.getByLabelText('Available');
            assert.isNotNull(within(select).queryByText('Moon'));
        });

        it('should exclude options not in the array from the available list', () => {
            render((
                <DualListBox
                    available={['luna']}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const select = screen.getByLabelText('Available');
            assert.isNull(within(select).queryByText('Phobos'));
        });

        it('should not interfere with selected options', () => {
            render((
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

            const select = screen.getByLabelText('Selected');
            assert.isNotNull(within(select).queryByText('Moon'));
            assert.isNotNull(within(select).queryByText('Phobos'));
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/110
        it('should apply even if we allow duplicates', () => {
            render((
                <DualListBox
                    allowDuplicates
                    available={['luna']}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const select = screen.getByLabelText('Available');
            assert.isNotNull(within(select).queryByText('Moon'));
            assert.isNull(within(select).queryByText('Phobos'));
        });
    });

    describe('props.canFilter', () => {
        it('should render the available and selected filter inputs', () => {
            render((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(screen.queryByLabelText('Filter available'));
            assert.isNotNull(screen.queryByLabelText('Filter selected'));
        });

        it('should do a substring filter by default', async () => {
            const { user } = setup((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const filter = screen.getByLabelText('Filter available');
            const select = screen.getByLabelText('Available');

            await user.type(filter, 'mo');

            assert.isNotNull(within(select).queryByText('Moon'));
            assert.isNull(within(select).queryByText('Phobos'));
        });

        it('should show children of an optgroup that passes the filter by default', async () => {
            const { user } = setup((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        {
                            label: 'Mars',
                            options: [
                                { label: 'Phobos', value: 'phobos' },
                                { label: 'Deimos', value: 'deimos' },
                            ],
                        },
                    ]}
                    onChange={() => {}}
                />
            ));

            const filter = screen.getByLabelText('Filter available');
            const select = screen.getByLabelText('Available');

            await user.type(filter, 'mars');

            assert.isNull(within(select).queryByText('Moon'));
            assert.isNotNull(within(select).queryByText('Phobos'));
            assert.isNotNull(within(select).queryByText('Deimos'));
        });

        it('should not error on a substring filter that contains regex characters', async () => {
            const { user } = setup((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos (Mars)', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const filter = screen.getByLabelText('Filter available');
            const select = screen.getByLabelText('Available');

            await user.type(filter, '(mars');

            assert.isNull(within(select).queryByText('Moon'));
            assert.isNotNull(within(select).queryByText('Phobos (Mars)'));
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/142
        it('should remove the proper highlighted option when `preserveSelectOrder` is set', async () => {
            let actualSelected = null;

            const { user } = setup((
                <DualListBox
                    canFilter
                    options={[
                        { label: 'Moon', value: 'luna' },
                        {
                            label: 'Mars',
                            options: [
                                { value: 'phobos', label: 'Phobos' },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos']}
                    onChange={(selected) => {
                        actualSelected = selected;
                    }}
                />
            ));

            const filter = screen.getByLabelText('Filter selected');
            const select = screen.getByLabelText('Selected');
            const moveLeft = screen.getByLabelText('Move to available');

            await user.type(filter, 'os');
            await user.selectOptions(select, ['deimos']);
            await user.click(moveLeft);

            assert.deepEqual(['luna', 'phobos'], actualSelected);
        });
    });

    describe('props.className', () => {
        it('should apply the class to the root node if set', () => {
            const { container } = render((
                <DualListBox
                    className="my-class"
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            const element = container.querySelector('.react-dual-listbox');
            assert.isTrue(element.classList.contains('my-class'));
        });

        it('should not change the root classes if empty', () => {
            const { container } = render((
                <DualListBox
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            const element = container.querySelector('.react-dual-listbox');
            assert.equal(element.className, 'react-dual-listbox rdl-icons-fa6');
        });
    });

    describe('props.disabled', () => {
        it('should assign the disabled property to all inputs, selects, and buttons when true', async () => {
            render((
                <DualListBox
                    disabled
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            const select = await screen.findByLabelText('Available');
            const button = await screen.findByLabelText('Move to selected');

            assert.isTrue(select.closest('select').disabled);
            assert.isTrue(button.closest('button').disabled);
        });

        it('should NOT assign the disabled property to all inputs, selects, and buttons when false', async () => {
            render((
                <DualListBox
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            const select = await screen.findByLabelText('Available');
            const button = await screen.findByLabelText('Move to selected');

            assert.isFalse(select.closest('select').disabled);
            assert.isFalse(button.closest('button').disabled);
        });
    });

    describe('props.filter', () => {
        it('should set the value of the filter text boxes', async () => {
            render((
                <DualListBox
                    canFilter
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

            const availableFilter = await screen.findByLabelText('Filter available');
            const selectedFilter = await screen.findByLabelText('Filter selected');

            assert.equal(availableFilter.value, 'pho');
            assert.equal(selectedFilter.value, 'europa');
        });

        it('should update the filter value on subsequent property change', async () => {
            const options = [
                { label: 'Phobos', value: 'phobos' },
                { label: 'Europa', value: 'europa' },
            ];
            const { rerender } = render((
                <DualListBox
                    canFilter
                    filter={{
                        available: 'ganymede',
                        selected: '',
                    }}
                    options={options}
                    onChange={() => {}}
                />
            ));

            rerender((
                <DualListBox
                    canFilter
                    filter={{
                        available: 'europa',
                        selected: '',
                    }}
                    options={options}
                    onChange={() => {}}
                />
            ));

            const availableFilter = await screen.findByLabelText('Filter available');
            assert.equal(availableFilter.value, 'europa');
        });
    });

    describe('props.filterCallback', () => {
        it('should invoke the filterCallback function with the available options', async () => {
            let available = [];

            const { user } = setup((
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

            const filter = screen.getByLabelText('Filter available');

            // Initial render
            assert.deepEqual(available, ['luna', 'phobos']);

            // Clear for subsequent re-render
            available = [];
            await user.type(filter, 'o');

            assert.deepEqual(available, ['luna', 'phobos']);
        });

        it('should invoke the filterCallback function with the input string', async () => {
            let filterInput = '';

            const { user } = setup((
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

            const filter = screen.getByLabelText('Filter available');
            await user.type(filter, 'mo');

            assert.deepEqual('mo', filterInput);
        });
    });

    describe('props.getOptionLabel', () => {
        it('should allow users to specify how to fetch the label', () => {
            render((
                <DualListBox
                    getOptionLabel={({ name }) => name}
                    options={[
                        { name: 'Moon', value: 'luna' },
                        { name: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(screen.getByText('Moon'));
        });
    });

    describe('props.getOptionValue', () => {
        it('should allow users to specify how to fetch the value', async () => {
            let actual = null;
            const { user } = setup((
                <DualListBox
                    getOptionValue={({ id }) => id}
                    options={[
                        { name: 'Moon', id: 'luna' },
                        { name: 'Phobos', id: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            await user.click(screen.getByLabelText('Move all to selected'));
            assert.deepEqual(actual, ['luna', 'phobos']);
        });
    });

    describe('props.htmlDir', () => {
        it('should should default to LTR', () => {
            const { container } = render((
                <DualListBox
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            assert.deepEqual(container.querySelector('.react-dual-listbox').dir, 'ltr');
        });

        it('should set the HTML `dir` property to the assigned value', () => {
            const { container } = render((
                <DualListBox
                    htmlDir="rtl"
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            assert.deepEqual(container.querySelector('.react-dual-listbox').dir, 'rtl');
        });
    });

    describe('props.icons', () => {
        it('should overwrite the default nodes for any given action', async () => {
            render((
                <DualListBox
                    icons={{
                        moveAllToSelected: <span className="new-icon" />,
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const button = await screen.findByLabelText('Move all to selected');
            assert.isNotNull(
                button.closest('button').querySelector('.new-icon'),
            );
        });

        it('should use the defaults when a key is missing', async () => {
            render((
                <DualListBox
                    icons={{
                        moveAllToSelected: <span className="new-icon" />,
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const button = await screen.findByLabelText('Move all to available');
            assert.isNotNull(
                button.closest('button').querySelector('.rdl-icon-move-all-to-available'),
            );
        });
    });

    describe('props.iconsClass', () => {
        it('should append the class name to parent name', () => {
            const { container } = render((
                <DualListBox
                    iconsClass="native"
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                />
            ));

            const actual = container.querySelector('.react-dual-listbox').className;
            assert.deepEqual(actual, 'react-dual-listbox rdl-icons-native');
        });
    });

    describe('props.id', () => {
        it('should pass the id to child elements', () => {
            const { container } = render((
                <DualListBox
                    id={testId}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(container.querySelector(`#${testId}-available`));
        });
    });

    describe('props.lang', () => {
        it('should overwrite the default text when set', async () => {
            render((
                <DualListBox
                    lang={{
                        moveAllToSelected: 'MOVE.ALL.RIGHT',
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const button = await screen.queryByLabelText('MOVE.ALL.RIGHT');

            assert.isNotNull(button);
            assert.isTrue(
                button.closest('button').classList.contains('rdl-move-all-to-selected'),
            );
        });

        it('should use the defaults when a key is missing', async () => {
            render((
                <DualListBox
                    lang={{
                        moveAllToSelected: 'MOVE.ALL.RIGHT',
                    }}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            const button = await screen.queryByLabelText('Move all to available');

            assert.isNotNull(button);
            assert.isTrue(
                button.closest('button').classList.contains('rdl-move-all-to-available'),
            );
        });
    });

    describe('props.moveKey', () => {
        it('should trigger `onChange` for the given key codes', async () => {
            let actual = null;

            const { user } = setup((
                <DualListBox
                    moveKeys={['Shift', 'Enter']}
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Available');

            await user.selectOptions(select, ['phobos']);
            await user.type(select, '{Shift}');

            assert.deepEqual(actual, ['phobos']);

            await user.selectOptions(select, ['luna', 'phobos']);
            await user.type(select, '{Enter}');

            assert.deepEqual(actual, ['luna', 'phobos']);
        });
    });

    describe('props.options', () => {
        it('should render the supplied options', () => {
            render((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(screen.getByText('Moon').closest('option'));
            assert.isNotNull(screen.getByText('Phobos').closest('option'));
        });

        it('should render optgroups and their children', () => {
            const { container } = render((
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

            const optgroup = container.querySelector('optgroup');

            assert.equal(optgroup.label, 'Mars');
            assert.isNotNull(within(optgroup).getByText('Phobos').closest('option'));
            assert.isNotNull(within(optgroup).getByText('Deimos').closest('option'));
        });

        it('should disable marked options and optgroups', () => {
            const { container } = render((
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

            const optgroup = container.querySelector('optgroup');

            assert.isTrue(optgroup.disabled);
            assert.isTrue(within(optgroup).getByText('Phobos').closest('option').disabled);
            assert.isFalse(within(optgroup).getByText('Deimos').closest('option').disabled);
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/148
        it('should prevent disabled options and optgroups from moving', async () => {
            let actual = [];

            const { user } = setup((
                <DualListBox
                    options={[
                        {
                            label: 'Earth',
                            options: [
                                { value: 'luna', label: 'Moon' },
                            ],
                        },
                        {
                            label: 'Mars',
                            options: [
                                { value: 'phobos', label: 'Phobos', disabled: true },
                                { value: 'deimos', label: 'Deimos' },
                            ],
                        },
                        {
                            label: 'Jupiter',
                            disabled: true,
                            options: [
                                { value: 'io', label: 'Io' },
                                { value: 'europa', label: 'Europa' },
                                { value: 'ganymede', label: 'Ganymede' },
                                { value: 'callisto', label: 'Callisto' },
                            ],
                        },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            // Everything but the Jovian moves should move to the right
            await user.click(screen.getByLabelText('Move all to selected'));
            assert.deepEqual(actual, ['luna', 'phobos', 'deimos']);

            // The disabled Phobos should remain when moving everything left
            await user.click(screen.getByLabelText('Move all to available'));
            assert.deepEqual(actual, ['phobos']);
        });

        it('should add the `title` attribute to specified options', () => {
            const { container } = render((
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

            const optgroup = container.querySelector('optgroup');

            assert.equal(optgroup.title, 'That one planet we may someday colonize');
            assert.equal(within(optgroup).getByText('Phobos').title, 'The larger one');
            assert.equal(within(optgroup).getByText('Deimos').title, '');
        });
    });

    describe('props.preserveSelectOrder', () => {
        it('should arrange the selected options by their original order when false', () => {
            const { container } = render((
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

            const options = container.querySelectorAll('.rdl-selected option');

            assert.equal(options[0].value, 'luna');
            assert.equal(options[1].value, 'phobos');
        });

        it('should arrange the selected options by their selection order when true', () => {
            const { container } = render((
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

            const options = container.querySelectorAll('.rdl-selected option');

            assert.equal(options[0].value, 'phobos');
            assert.equal(options[1].value, 'luna');
        });
    });

    describe('props.required', () => {
        it('should render required text input', () => {
            const { container } = render((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    required
                    selected={[]}
                    onChange={() => {}}
                />
            ));

            assert.isTrue(container.querySelector('input[type="text"]').required);
        });

        it('should concatenate the selected options', () => {
            const { container } = render((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    required
                    selected={['luna', 'phobos']}
                    onChange={() => {}}
                />
            ));

            assert.equal('luna,phobos', container.querySelector('.rdl-hidden-input').value);
        });

        it('should use the value for `lang.requiredError` when triggering a validation message', () => {
            let actualMessage = null;
            let form = null;
            const expectedMessage = 'My custom error message.';

            render((
                <form
                    ref={(c) => {
                        form = c;
                    }}
                    onInvalid={(event) => {
                        actualMessage = event.target.validationMessage;
                    }}
                >
                    <DualListBox
                        lang={{
                            moveLeft: '',
                            moveAllLeft: '',
                            moveRight: '',
                            moveAllRight: '',
                            requiredError: expectedMessage,
                        }}
                        options={[
                            { label: 'Moon', value: 'luna' },
                            { label: 'Phobos', value: 'phobos' },
                        ]}
                        required
                        selected={[]}
                        onChange={() => {}}
                    />
                </form>
            ));

            form.checkValidity();
            assert.equal(expectedMessage, actualMessage);
        });
    });

    describe('props.selected', () => {
        it('should render selected options', () => {
            render((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['phobos']}
                    onChange={() => {}}
                />
            ));

            const select = screen.findByLabelText('Selected');
            assert.isNotNull(within(select).findByText('Phobos'));
        });
    });

    describe('props.showHeaderLabels', () => {
        it('should make the labels above the list boxes appear when set to true', () => {
            const { container } = render((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                    ]}
                    showHeaderLabels
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(container.querySelector('.rdl-has-header'));
        });

        it('should hide the labels above the list boxes when set to false', () => {
            const { container } = render((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                    ]}
                    showHeaderLabels={false}
                    onChange={() => {}}
                />
            ));

            assert.isNull(container.querySelector('.rdl-has-header'));
        });
    });

    describe('props.showNoOptionsText', () => {
        it('should render text in place of available/selected list boxes when no options are present', () => {
            const { container } = render((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                    ]}
                    showNoOptionsText
                    onChange={() => {}}
                />
            ));

            assert.isNotNull(container.querySelector('.rdl-selected .rdl-no-options'));
        });
    });

    describe('props.showOrderButtons', () => {
        it('should render the top, up, down, and bottom action buttons', () => {
            render((
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

            assert.isNotNull(screen.findByLabelText('Rearrange to top'));
            assert.isNotNull(screen.findByLabelText('Rearrange up'));
            assert.isNotNull(screen.findByLabelText('Rearrange down'));
            assert.isNotNull(screen.findByLabelText('Rearrange to bottom'));
        });

        it('should move a single item up or down when the respective button is clicked', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['phobos']);
            await user.click(screen.getByLabelText('Rearrange up'));

            assert.deepEqual(actual, ['phobos', 'luna', 'deimos', 'io']);

            await user.selectOptions(select, ['phobos']);
            await user.click(screen.getByLabelText('Rearrange down'));

            // Since we actually did not change the selected order, the down action is applied on
            // the original selected order
            assert.deepEqual(actual, ['luna', 'deimos', 'phobos', 'io']);
        });

        it('should move non-adjacent marked items such that they maintain their separation', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['phobos', 'io']);
            await user.click(screen.getByLabelText('Rearrange up'));

            assert.deepEqual(actual, ['phobos', 'luna', 'io', 'deimos']);
        });

        it('should move adjacent items together, pushing the next non-marked item up or down', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['phobos', 'deimos']);
            await user.click(screen.getByLabelText('Rearrange up'));

            assert.deepEqual(actual, ['phobos', 'deimos', 'luna', 'io']);
        });

        it('should not change the order of items that are already at the top or bottom', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['luna', 'phobos']);
            await user.click(screen.getByLabelText('Rearrange up'));

            assert.deepEqual(actual, ['luna', 'phobos', 'deimos', 'io']);
        });

        it('should preserve the order if nothing is marked', async () => {
            let actual = null;

            const { user } = setup((
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

            await user.click(screen.getByLabelText('Rearrange up'));

            assert.deepEqual(actual, ['luna', 'phobos', 'deimos', 'io']);
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/57
        it('should not error when nothing is in the selected list', async () => {
            const { user } = setup((
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

            await user.click(screen.getByLabelText('Rearrange up'));
        });

        it('should move selected items to top when top button is clicked', async () => {
            let actual = null;

            const { user } = setup((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['deimos']);
            await user.click(screen.getByLabelText('Rearrange to top'));

            assert.deepEqual(actual, ['deimos', 'luna', 'phobos']);
        });

        it('should move selected items to bottom when bottom button is clicked', async () => {
            let actual = null;

            const { user } = setup((
                <DualListBox
                    options={[
                        { value: 'luna', label: 'Moon' },
                        { value: 'phobos', label: 'Phobos' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'io', label: 'Io' },
                    ]}
                    preserveSelectOrder
                    selected={['luna', 'phobos', 'deimos']}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['luna', 'phobos']);
            await user.click(screen.getByLabelText('Rearrange to bottom'));

            assert.deepEqual(actual, ['deimos', 'luna', 'phobos']);
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/217
        it('should not clear out selections after moving', async () => {
            const options = [
                { value: 'luna', label: 'Moon' },
                { value: 'phobos', label: 'Phobos' },
                { value: 'deimos', label: 'Deimos' },
                { value: 'io', label: 'Io' },
            ];
            let selected = ['io', 'deimos', 'phobos'];

            const { rerender, user } = setup((
                <DualListBox
                    options={options}
                    preserveSelectOrder
                    selected={selected}
                    showOrderButtons
                    onChange={(newSelected) => {
                        selected = newSelected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');
            const io = screen.getByRole('option', { name: 'Io' });

            await user.selectOptions(select, ['io']);
            await user.click(screen.getByLabelText('Rearrange down'));

            // Apply re-arrangement changes
            rerender((
                <DualListBox
                    options={options}
                    preserveSelectOrder
                    selected={selected}
                    showOrderButtons
                    onChange={() => {}}
                />
            ));

            assert.isTrue(io.selected);
        });
    });

    describe('props.onChange', () => {
        it('should pass all options in the selected listbox after a change', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Available');

            await user.selectOptions(select, ['phobos']);
            await user.dblClick(select);

            assert.deepEqual(actual, ['phobos']);
        });

        it('should preserve previous selections', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Available');

            await user.selectOptions(select, ['phobos']);
            await user.dblClick(select);

            assert.deepEqual(actual, ['luna', 'phobos']);
        });

        it('should handle numeric and string values', async () => {
            let actual = null;

            const { user } = setup((
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

            const select = screen.getByLabelText('Available');

            await user.selectOptions(select, ['2']);
            await user.dblClick(select);

            assert.deepEqual(actual, ['one', 2]);
        });

        it('should pass all the options the user highlighted before the change', async () => {
            let actualSelected = null;
            let actualSelection = null;

            const { user } = setup((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={(selected, selection) => {
                        actualSelected = selected;
                        actualSelection = selection;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['luna', 'phobos']);
            await user.click(screen.getByLabelText('Move to available'));

            assert.deepEqual(actualSelected, []);
            assert.deepEqual(actualSelection, ['luna', 'phobos']);
        });

        it('should identify the control responsible for the changes', async () => {
            let actualControlKey = null;

            const { user } = setup((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={['luna', 'phobos']}
                    onChange={(selected, selection, controlKey) => {
                        actualControlKey = controlKey;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['luna', 'phobos']);
            await user.click(screen.getByLabelText('Move to available'));

            assert.equal(actualControlKey, 'selected');
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/139
        it('should not persist selections/highlights after moving options', async () => {
            const { user } = setup((
                <DualListBox
                    options={[
                        { label: 'Option 1', value: 'one' },
                        { label: 'Option 2', value: 'two' },
                        { label: 'Option 3', value: 'three' },
                    ]}
                    selected={['one']}
                    onChange={() => {}}
                />
            ));

            const available = screen.getByLabelText('Available');
            const selected = screen.getByLabelText('Selected');

            // Test clearing of available selections
            await user.selectOptions(available, ['two']);
            await user.click(screen.getByLabelText('Move to selected'));

            assert.deepEqual(available.closest('select').value, '');

            // Test clearing of selected selections
            await user.selectOptions(selected, ['one']);
            await user.click(screen.getByLabelText('Move to available'));

            assert.deepEqual(selected.closest('select').value, '');
        });

        it('should trigger on double-clicking an option', async () => {
            let actual = null;

            const { user } = setup((
                <DualListBox
                    options={[
                        { label: 'Option 1', value: 'one' },
                        { label: 'Option 2', value: 'two' },
                    ]}
                    selected={['one']}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['one']);
            await user.dblClick(select);

            assert.deepEqual(actual, []);
        });

        it('should not trigger when double-clicking a parent', async () => {
            let actual = null;

            const { container, user } = setup((
                <DualListBox
                    options={[
                        {
                            label: 'Parent',
                            options: [
                                { label: 'Option 1', value: 'one' },
                                { label: 'Option 2', value: 'two' },
                            ],
                        },
                    ]}
                    selected={[]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Available');
            const optgroup = container.querySelector('optgroup');

            await user.selectOptions(select, ['one']);
            await user.dblClick(optgroup);

            assert.deepEqual(actual, null);
        });
    });

    describe('props.onFilterChange', () => {
        it('should be called with the updated filter value', async () => {
            let filter = {
                available: 'ph',
                selected: '',
            };

            const { user } = setup((
                <DualListBox
                    canFilter
                    filter={filter}
                    options={[{ label: 'Phobos', value: 'phobos' }]}
                    onChange={() => {}}
                    onFilterChange={(newFilter) => {
                        filter = newFilter;
                    }}
                />
            ));

            const input = screen.getByLabelText('Filter available');
            await user.type(input, 'o');

            assert.deepEqual(filter, {
                available: 'pho',
                selected: '',
            });
        });
    });

    describe('moveRight', () => {
        it('should call onChange with the newly-selected options', async () => {
            let actual = null;

            const { user } = setup((
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

            const available = screen.getByLabelText('Available');

            await user.selectOptions(available, ['phobos']);
            await user.click(screen.getByLabelText('Move to selected'));

            assert.deepEqual(actual, ['phobos']);
        });

        it('should persist previously-selected values', async () => {
            let actual = null;

            const { user } = setup((
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

            const available = screen.getByLabelText('Available');

            await user.selectOptions(available, ['phobos']);
            await user.click(screen.getByLabelText('Move to selected'));

            assert.deepEqual(actual, ['deimos', 'phobos']);
        });
    });

    describe('moveAllRight', () => {
        it('should call onChange with all available options selected', async () => {
            let actual = null;

            const { user } = setup((
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

            await user.click(screen.getByLabelText('Move all to selected'));

            assert.deepEqual(actual, ['luna', 'phobos']);
        });

        // https://github.com/jakezatecky/react-dual-listbox/issues/53
        it('should not duplicate any existing selections', async () => {
            let actual = null;

            const { user } = setup((
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

            await user.click(screen.getByLabelText('Move all to selected'));

            assert.deepEqual(actual, ['phobos', 'deimos']);
        });
    });

    describe('moveLeft', () => {
        it('should call onChange with the newly-selected options removed', async () => {
            let actual = null;

            const { user } = setup((
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

            const selected = screen.getByLabelText('Selected');

            await user.selectOptions(selected, ['phobos', 'deimos']);
            await user.click(screen.getByLabelText('Move to available'));

            assert.deepEqual(actual, []);
        });
    });

    describe('moveAllLeft', () => {
        it('should call onChange with no options selected', async () => {
            let actual = null;

            const { user } = setup((
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

            await user.click(screen.getByLabelText('Move all to available'));

            assert.deepEqual(actual, []);
        });
    });
});
