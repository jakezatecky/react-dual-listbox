import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef } from 'react';

import { LanguageContext } from '../contexts';
import valueShape from '../shapes/valueShape';

const noop = () => {};
const propTypes = {
    disabled: PropTypes.bool.isRequired,
    required: PropTypes.bool.isRequired,
    selected: valueShape.isRequired,
    onFocus: PropTypes.func.isRequired,

    name: PropTypes.string,
};
const defaultProps = {
    name: null,
};

function HiddenInput({
    disabled,
    name,
    required,
    selected,
    onFocus,
}) {
    const { requiredError } = useContext(LanguageContext);
    const input = useRef(null);

    useEffect(() => {
        if (!required) {
            return;
        }

        // If required, set a validity error when no options are selected
        const validity = selected.length === 0 ? requiredError : '';
        input.current.setCustomValidity(validity);
    });

    const hiddenValue = selected.join(',');

    return (
        <input
            className="rdl-hidden-input"
            disabled={disabled}
            name={name}
            ref={input}
            required={required}
            type={required ? 'text' : 'hidden'}
            value={hiddenValue}
            onChange={noop}
            onFocus={onFocus}
        />
    );
}

HiddenInput.propTypes = propTypes;
HiddenInput.defaultProps = defaultProps;

export default HiddenInput;
