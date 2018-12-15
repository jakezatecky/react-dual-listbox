import PropTypes from 'prop-types';

import optionShape from './optionShape';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.string,
        optionShape,
        PropTypes.shape({
            value: PropTypes.any,
            options: PropTypes.arrayOf(optionShape),
        }),
    ]),
);
