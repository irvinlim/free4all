export default function loginDialogMessage(state = "", action) {
  switch (action.type) {
    case 'OPEN_LOGIN_DIALOG':
      if (action.message)
        return action.message;
      else
        return "";

    case 'CLOSE_LOGIN_DIALOG':
      return "";

    default:
      return state;
  }
}
