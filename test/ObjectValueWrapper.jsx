import { configure } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import React from 'react';

import { ObjectValueWrapper as DualListBox } from '../src';

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

describe('ObjectValueWrapper', () => {
    describe('props.allowDuplicates', () => {
        // https://github.com/jakezatecky/react-dual-listbox/issues/103
        it('should work with ObjectValueWrapper', async () => {
            let actual = null;

            const { user } = setup((
                <DualListBox
                    allowDuplicates
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={[{ label: 'Moon', value: 'luna' }]}
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Available');
            await user.selectOptions(select, ['Moon']);
            await user.dblClick(select);

            assert.deepEqual(actual, [
                { label: 'Moon', value: 'luna' },
                { label: 'Moon', value: 'luna' },
            ]);
        });
    });

    describe('props.onChange', () => {
        it('should pass an array of options', async () => {
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

            assert.deepEqual(actual, [{
                label: 'Phobos',
                value: 'phobos',
            }]);
        });

        it('should also pass optgroups', async () => {
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
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Available');

            await user.selectOptions(select, ['phobos']);
            await user.dblClick(select);

            assert.deepEqual(actual, [{
                label: 'Mars',
                options: [{
                    label: 'Phobos',
                    value: 'phobos',
                }],
            }]);
        });

        it('should also impact those values highlighted by the user', async () => {
            let actualSelection = null;

            const { user } = setup((
                <DualListBox
                    options={[
                        { label: 'Moon', value: 'luna' },
                        { label: 'Phobos', value: 'phobos' },
                    ]}
                    selected={[]}
                    onChange={(selected, selection) => {
                        actualSelection = selection;
                    }}
                />
            ));

            const select = screen.getByLabelText('Available');

            await user.selectOptions(select, ['phobos']);
            await user.click(screen.getByLabelText('Move to selected'));

            assert.deepEqual(actualSelection, [
                { label: 'Phobos', value: 'phobos' },
            ]);
        });
    });

    describe('props.showOrderButtons', () => {
        // https://github.com/jakezatecky/react-dual-listbox/issues/113
        it('should play nicely with ObjectValueWrapper', async () => {
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
                    selected={[
                        { value: 'io', label: 'Io' },
                        { value: 'deimos', label: 'Deimos' },
                        { value: 'phobos', label: 'Phobos' },
                    ]}
                    showOrderButtons
                    onChange={(selected) => {
                        actual = selected;
                    }}
                />
            ));

            const select = screen.getByLabelText('Selected');

            await user.selectOptions(select, ['io']);
            await user.click(screen.getByLabelText('Rearrange down'));

            assert.deepEqual(actual, [
                { value: 'deimos', label: 'Deimos' },
                { value: 'io', label: 'Io' },
                { value: 'phobos', label: 'Phobos' },
            ]);
        });
    });
});
