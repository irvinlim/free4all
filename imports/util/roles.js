export const onlyOwner = (testUserId, ownerUserId) => testUserId === ownerUserId;
export const ownerOrModsOrAdmins = (testUserId, ownerUserId) => onlyOwner(testUserId, ownerUserId) || Roles.userIsInRole(testUserId, ['moderator', 'admin']);
export const modsOrAdmins = (testUserId) => Roles.userIsInRole(testUserId, ['moderator', 'admin']);
export const onlyAdmins = (testUserId) => Roles.userIsInRole(testUserId, ['admin']);

export const isBanned = (testUserId) => Roles.userIsInRole(testUserId, ['banned']);
export const isReported = (testUserId) => Roles.userIsInRole(testUserId, ['reported']);

export const findModsOrAdmins = () => Meteor.users.find({ roles: { $elemMatch: { $in: ['moderator', 'admin'] } } }).fetch();
