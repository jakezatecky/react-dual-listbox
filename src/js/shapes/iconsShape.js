import PropTypes from 'prop-types';

export default PropTypes.shape({
    moveLeft: PropTypes.node.isRequired,
    moveAllLeft: PropTypes.node.isRequired,
    moveRight: PropTypes.node.isRequired,
    moveAllRight: PropTypes.node.isRequired,
    // Optional, so not required
    moveDown: PropTypes.node,
    moveUp: PropTypes.node,
});
