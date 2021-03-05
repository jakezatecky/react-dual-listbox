import PropTypes from 'prop-types';

import optionShape from './optionShape';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        optionShape,
        PropTypes.shape({
            label: PropTypes.node.isRequired,
            options: PropTypes.arrayOf(optionShape).isRequired,

            // Optional properties
            disabled: PropTypes.bool,
            title: PropTypes.title,
        }),
    ]),
);
