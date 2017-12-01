import { combineReducers } from 'redux';
import shortid from 'shortid';
import axios from 'axios';
import moment from 'moment';
// import { routerReducer } from 'react-router-redux';
import voting from './voting';
import events from './events';


const saveTimeline = function (event, props, getTrip) {
  if (event && event.key !== 'Enter') { return; }

  const {
    startDate,
    endDate,
    timelineName,
  } = props;

  const start = moment(startDate);
  const end = moment(endDate);
  const timelineId = shortid.generate();
  const numberOfDays = end.diff(start, 'days');

  axios.post('/timeline', {
    timelineId,
    timelineName,
    numberOfDays,
  })
    .then(() => getTrip(timelineId))
    .catch(err => console.error('error in submit ', err));

  return ({
    timelineId,
    numberOfDays,
  });
};

const appState = (state = {}, action) => {
  switch (action.type) {
    case 'ON_INPUT_CHANGE':
      return {
        ...state,
        [action.name]: action.value,
      };
    case 'SET_TIMELINE_DATA':
      return {
        ...state,
        timelineData: action.data,
      };
    case 'SET_ID':
      return {
        ...state,
        timelineId: action.id,
      };
    case 'SET_DAYS':
      return {
        ...state,
        numberOfDays: action.days,
      };
    case 'CREATE_DAY_SELECT':
      return {
        ...state,
        createEventDay: action.days,
      };
    case 'SET_NEW_EVENT':
      return {
        ...state,
        newEvent: action.event,
      };
    case 'SET_NEW_EVENT_ADDRESS':
      return {
        ...state,
        newEventAddress: action.address,
      };
    case 'SAVE_TIMELINE':
      return {
        ...state,
        ...saveTimeline(action.event, state, action.getTrip),
      };
    case 'GET_TRIP':
      const { data } = action;
      const { timelineId, timelineName } = data[0];
      return {
        ...state,
        timelineData: data,
        timelineId,
        timelineName,
        numberOfDays: data.length,
      };
    case 'GET_TRIP_ERROR':
      console.log(action.error);
      return state;
    default:
      return state;
  }
};


export default combineReducers({ voting, events, appState });