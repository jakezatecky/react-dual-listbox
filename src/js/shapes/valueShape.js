import PropTypes from 'prop-types';

import optionShape from './optionShape';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.string,
        optionShape,
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            options: PropTypes.arrayOf(optionShape),
        }),
    ]),
);
