import fs from 'fs';
import gutil from 'gulp-util';
import path from 'path';
import stripComments from 'strip-json-comments';

/**
 * Project
 * A class to navigate to relevant directories in the app
 *
 * @class ProjectPath
 */
export class Project {
  paths = {
    cwd: path.resolve(__dirname, '../../'),
    gulp: {},
    dirs: {
      base: '../'
    }
  };

  /**
   * Constructor
   * Initializes our Filetree instance with paths if supplied
   *
   * @constructor
   * @param {object} [paths] - Object of subobjects and strings
   */
  constructor (paths) {
    if (paths) this.extend(paths);
  }

  /**
   * Get Config
   * Joins x amount of arguments
   *
   * @method
   * @public
   * @param {string} filepath - Config file to load
   * @returns {object} JSON Object of config file
   */
  getJSONConfig (filepath) {
    return JSON.parse(stripComments(fs.readFileSync(path.resolve(this.paths.cwd, filepath))));
  }

  /**
   * Extend
   * Extends an object containing paths onto our paths object
   *
   * @method
   * @public
   * @param {object} [paths] - Object of subobjects and strings
   * @returns {object} - Mutated paths object
   */
  extend (paths) {
    if (!paths) return false;

    Object.assign(this.paths, paths);

    return this.paths;
  }

  /**
   * Join
   * Joins x amount of arguments
   *
   * @method
   * @public
   * @param {...string} paths - File paths to build into a single filepath
   * @returns {string} New filepath
   */
  join (...args) {
    return path.join(...args);
  }

  /**
   * Resolve
   * Used to resolve a command line argument to a file path
   *
   * @method
   * @public
   * @param {string} basepath - Base folder to start from
   * @param {string} filepath - File path to resolve
   * @returns {string} Resolved filepath
   */
  resolve (basepath, filepath) {
    var file = this.join(basepath, filepath);

    /**
     * See if it's just current working directory + filepath
     */
    try {
      fs.accessSync(file);
      return file;
    } catch (e) {
      file = this.to(basepath, file);
    }

    try {
      fs.accessSync(file);
      return file;
    } catch (e) {
      throw new gutil.PluginError('PATHS', `Could not find file: ${file}`);
    }
  }

  /**
   * Split
   * Returns an array of all directories
   *
   * @method
   * @public
   * @param {string} filepath - Path string to split
   * @returns {array} All parts of the path
  **/
  split (filepath) {
    return filepath.split(path.separator);
  }

  /**
   * To
   * Returns the path to the specified file from the instevent base dir
   *
   * @method
   * @public
   * @param {...string} glob - Either a / separated string or all arguments
   * @returns {string} New filepath
  **/
  to (...args) {
    /** If the first argument doesn't start with the base, add it. */
    if (args[0].indexOf(this.paths.dirs.base) === -1) {
      args.unshift(this.paths.dirs.base);
    }

    return this.join(...args);
  }

  /**
   * From
   * Returns the relative path from a target to a base.
   *
   * @method
   * @public
   * @param {string} base - The base directory to start from
   * @param {string} to - The target file or directory
   * @returns {string} The relative path
  **/
  from (base, to) {
    return path.relative(base, to);
  }

  /**
   * From JS To
   * Returns the relative path from our js directory.
   *
   * @method
   * @public
   * @param {string} to - Target path to reach
   * @returns {string} The relative path to the target from the base.
  **/
  fromJsTo (to) {
    return this.from(this.paths.js.dir, to);
  }
}

export default new Project();
