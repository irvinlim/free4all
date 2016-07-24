export const onlyOwner = (testUserId, ownerUserId) => testUserId === ownerUserId;
export const ownerOrModsOrAdmins = (testUserId, ownerUserId) => onlyOwner(testUserId, ownerUserId) || Roles.userIsInRole(testUserId, ['moderator', 'admin']);
export const modsOrAdmins = (testUserId) => Roles.userIsInRole(testUserId, ['moderator', 'admin']);
export const onlyAdmins = (testUserId) => Roles.userIsInRole(testUserId, ['admin']);
