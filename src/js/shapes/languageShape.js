import PropTypes from 'prop-types';

export default PropTypes.shape({
    availableFilterHeader: PropTypes.string,
    availableHeader: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    moveLeft: PropTypes.string,
    moveAllLeft: PropTypes.string,
    moveRight: PropTypes.string,
    moveAllRight: PropTypes.string,
    moveDown: PropTypes.string,
    moveUp: PropTypes.string,
    noAvailableOptions: PropTypes.string,
    noSelectedOptions: PropTypes.string,
    requiredError: PropTypes.string,
    selectedFilterHeader: PropTypes.string,
    selectedHeader: PropTypes.string,
});
