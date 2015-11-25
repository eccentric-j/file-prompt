import { combineReducers } from 'redux';
import { ADD_FILE, REMOVE_FILE, NAVIGATE, NAVIGATE_COMPLETE, SET_CONFIG, SET_PATH } from './actions';

function files (state = [], action) {
  let newState = state.slice();

  switch (action.type) {
  case ADD_FILE:
    if (state.indexOf(action.file) > -1) return state;

    return state.concat([action.file]);

  case REMOVE_FILE:
    if (state.indexOf(action.file) === -1) return state;
    newState.splice(state.indexOf(action.file), 1);

    return newState;

  default:
    return state;
  }
}

function currentPage (state = { name: 'index', props: {}, is_navigating: false }, action) {
  switch (action.type) {
  case NAVIGATE:
    return { name: action.name, props: action.props, is_navigating: true };

  case NAVIGATE_COMPLETE:
    return { name: state.name, props: state.props, is_navigating: false };

  default:
    return state;
  }
}

function config (state = {}, action) {
  switch (action.type) {
  case SET_CONFIG:
    return Object.assign({}, state, action.config);

  default:
    return state;
  }
}

function path (state = "", action) {
  switch (action.type) {
  case SET_PATH:
    return action.path;

  default:
    return state;
  }
}

const reducers = combineReducers({ files, currentPage, config, path });

export default reducers;
