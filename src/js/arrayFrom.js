/**
 * Array.from ponyfill.
 *
 * @param {Object} iterable
 *
 * @returns {Array}
 */
export default function arrayFrom(iterable) {
    const arr = [];

    for (let i = 0; i < iterable.length; i += 1) {
        arr.push(iterable[i]);
    }

    return arr;
}
