import PropTypes from 'prop-types';

export default PropTypes.shape({
    moveLeft: PropTypes.string.isRequired,
    moveAllLeft: PropTypes.string.isRequired,
    moveRight: PropTypes.string.isRequired,
    moveAllRight: PropTypes.string.isRequired,

    // Optional properties
    availableFilterHeader: PropTypes.string,
    availableHeader: PropTypes.string,
    moveDown: PropTypes.string,
    moveUp: PropTypes.string,
    noAvailableOptions: PropTypes.string,
    noSelectedOptions: PropTypes.string,
    selectedFilterHeader: PropTypes.string,
    selectedHeader: PropTypes.string,
});
