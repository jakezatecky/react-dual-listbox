import PropTypes from 'prop-types';

export default PropTypes.shape({
    moveToAvailable: PropTypes.node.isRequired,
    moveAllToAvailable: PropTypes.node.isRequired,
    moveToSelected: PropTypes.node.isRequired,
    moveAllToSelected: PropTypes.node.isRequired,

    // Optional properties
    moveBottom: PropTypes.node,
    moveDown: PropTypes.node,
    moveUp: PropTypes.node,
    moveTop: PropTypes.node,
});
