import PropTypes from 'prop-types';

import optgroupShape from './optgroupShape';
import optionShape from './optionShape';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        optgroupShape,
        optionShape,
    ]),
);
