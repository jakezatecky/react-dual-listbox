import PropTypes from 'prop-types';

import optgroupShape from './optgroupShape';
import optionShape from './optionShape';

export default PropTypes.arrayOf(
    PropTypes.oneOfType([
        PropTypes.string,
        optgroupShape,
        optionShape,
    ]),
);
