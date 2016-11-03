const settings = (state = {}, action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      let { userToken } = action.payload;
      return {
        ...state,
        freshTokenPromise: null,
        refreshToken: null,
        tokenExpireTS: null,
        userToken
      };
    case 'SET_THEME':
      let { theme } = action.payload;
      return {
        ...state,
        theme
      };
    case 'RECEIVE_ACCOUNT':
      return {
        ...state,
        userId: action.payload.userId
      };
    case 'TOKEN_ERROR':
      return {
        ...state,
        userToken: null,
        refreshToken: null,
        tokenExpireTS: null,
        freshTokenPromise: null
      };
    default:
      return state;
  }
};
export default settings;