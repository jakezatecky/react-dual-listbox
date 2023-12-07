import PropTypes from 'prop-types';

export default PropTypes.shape({
    availableFilterHeader: PropTypes.string,
    availableHeader: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    moveToAvailable: PropTypes.string,
    moveAllToAvailable: PropTypes.string,
    moveToSelected: PropTypes.string,
    moveAllToSelected: PropTypes.string,
    moveDown: PropTypes.string,
    moveUp: PropTypes.string,
    noAvailableOptions: PropTypes.string,
    noSelectedOptions: PropTypes.string,
    requiredError: PropTypes.string,
    selectedFilterHeader: PropTypes.string,
    selectedHeader: PropTypes.string,
});
