import PropTypes from 'prop-types';

export default PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,

    // Optional properties
    disabled: PropTypes.bool,
    title: PropTypes.string,
});
