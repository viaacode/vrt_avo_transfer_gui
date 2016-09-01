var fs = require('fs');

/**
 * read file without crashing
 * @param path to the file
 * @returns {string} contents of file or null if error
 */
module.exports = function (path) {
  var file = null;
  try {
    file = fs.readFileSync(path, 'utf8');
  } catch (e) {
    console.warn('Error while reading file: ' + path);
  }
  return file;
};