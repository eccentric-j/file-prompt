import path from 'path';
import reducers from '../../src/reducers';
import { createStore } from 'redux';

export default class StoreFactory {
  static defaults = {
    config: {
      basedir: path.resolve(__dirname, '..', '..')
    },
    files: [],
    currentPage: {
      name: 'index',
      props: {}
    },
    path: ''
  };

  static create (data={}) {
    let store = createStore(reducers, Object.assign({}, StoreFactory.defaults, data));

    store.select = function select (keystr) {
      let selection = this.getState();

      keystr.split('.').forEach((key) => {
        selection = selection[key];
      });

      return selection;
    };

    return store;
  }
}
