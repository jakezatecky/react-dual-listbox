import PropTypes from 'prop-types';

const refShape = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
]);

export default refShape;
