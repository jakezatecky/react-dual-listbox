import PropTypes from 'prop-types';

export default PropTypes.shape({
    moveLeft: PropTypes.node.isRequired,
    moveAllLeft: PropTypes.node.isRequired,
    moveRight: PropTypes.node.isRequired,
    moveAllRight: PropTypes.node.isRequired,

    // Optional properties
    moveBottom: PropTypes.node,
    moveDown: PropTypes.node,
    moveUp: PropTypes.node,
    moveTop: PropTypes.node,
});
