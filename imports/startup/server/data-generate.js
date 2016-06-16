import { Meteor } from 'meteor/meteor';

import { Categories } from '../../api/categories/categories';
import { StatusTypes } from '../../api/status-types/status-types';
import { Giveaways } from '../../api/giveaways/giveaways';
import { StatusUpdates } from '../../api/status-updates/status-updates';

// Generate random markers
const NUSLngLatBounds = [[103.772069, 1.308454], [103.785097, 1.290162]];
const lngMin = NUSLngLatBounds[0][0];
const lngMax = NUSLngLatBounds[1][0];
const latMin = NUSLngLatBounds[1][1];
const latMax = NUSLngLatBounds[0][1];
let gaId, randomLng, randomLat, randomCat;

// for (let i = 0; i < 10; i++) {
//   randomLng = Math.random() * (lngMax - lngMin) + lngMin;
//   randomLat = Math.random() * (latMax - latMin) + latMin;
//   randomIDOffset = Math.floor(Math.random() * 500);
//   randomCat = Categories.findOne({}, { skip: Math.floor(Math.random() * Categories.find().count()) })._id;
//   randomStatus = StatusTypes.findOne({}, { skip: Math.floor(Math.random() * StatusTypes.find().count()) })._id;
//   randomUser = Meteor.users.findOne({}, { skip: Math.floor(Math.random() * Meteor.users.find().count()) })._id;

//   gaId = Giveaways.insert({
//     title:          "Giveaway #" + parseInt(i + randomIDOffset),
//     description:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus efficitur semper ligula vitae finibus. Nam cursus scelerisque tincidunt.",
//     startDateTime:  new Date(),
//     endDateTime:    new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
//     location:       "Random Location",
//     coordinates:    [ randomLng, randomLat ],
//     categoryId:     randomCat,
//     tags:           [ ],
//     userId:         randomUser,
//   });

//   StatusUpdates.insert({
//     giveawayId:   gaId,
//     statusTypeId: randomStatus,
//     date:         new Date(),
//     userId:       randomUser,
//   });
// }
