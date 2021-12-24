/**
 * Clone the entire object (including nested properties) without its functions.
 *
 * @param {object} obj the object to clone
 * @returns the cloned object
 */
export function deepClone(obj) {
  return (obj ? JSON.parse(JSON.stringify(obj)) : undefined);
}
