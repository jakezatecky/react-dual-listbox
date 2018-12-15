import PropTypes from 'prop-types';

export default PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
});
