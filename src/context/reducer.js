export const initState = {
  isLogin: false,
  isPost: null,
  isFcmToken: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        ...state,
        isLogin: action.isLogin,
      };
    case 'SET_POST':
      return {
        ...state,
        isPost: action.isPost,
      };
    case 'SET_FCMTOKEN':
      return {
        ...state,
        isFcmToken: action.isFcmToken,
      };
    default:
      return state;
  }
};

export default reducer;
