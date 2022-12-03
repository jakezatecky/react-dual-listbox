import PropTypes from 'prop-types';

export default PropTypes.shape({
    moveToAvailable: PropTypes.string.isRequired,
    moveAllToAvailable: PropTypes.string.isRequired,
    moveToSelected: PropTypes.string.isRequired,
    moveAllToSelected: PropTypes.string.isRequired,

    // Optional properties
    availableFilterHeader: PropTypes.string,
    availableHeader: PropTypes.string,
    moveDown: PropTypes.string,
    moveUp: PropTypes.string,
    noAvailableOptions: PropTypes.string,
    noSelectedOptions: PropTypes.string,
    requiredError: PropTypes.string,
    selectedFilterHeader: PropTypes.string,
    selectedHeader: PropTypes.string,
});
