import { isEqual } from 'lodash';
/**
 * Return an array of indexes for all instances of the given value.
 *
 * @param {Array} list
 * @param {*} value
 *
 * @returns {Array}
 */
export default function indexesOf(list, value) {
    const indexes = [];

    list.forEach((listItem, index) => {
        if (isEqual(listItem, value)) {
            indexes.push(index);
        }
    });

    return indexes;
}
