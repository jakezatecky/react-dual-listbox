import PropTypes from 'prop-types';

export default PropTypes.shape({
    moveLeft: PropTypes.string.isRequired,
    moveRight: PropTypes.string.isRequired,
    moveAllLeft: PropTypes.string.isRequired,
    moveAllRight: PropTypes.string.isRequired,
});
