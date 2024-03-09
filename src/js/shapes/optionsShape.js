import PropTypes from 'prop-types';

import optgroupShape from '#js/shapes/optgroupShape.js';
import optionShape from '#js/shapes/optionShape.js';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        optgroupShape,
        optionShape,
    ]),
);
