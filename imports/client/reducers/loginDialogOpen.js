export default function loginDialogOpen(state = false, action) {
  switch (action.type) {
    case 'OPEN_LOGIN_DIALOG':
      return true;
    case 'CLOSE_LOGIN_DIALOG':
      return false;
    default:
      return state;
  }
}
