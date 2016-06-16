import { StatusUpdates } from './status-updates';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Non-reversible insertion. Must add new document to "update" it.
export const insertStatus = new ValidatedMethod({
	name: 'status-update.insert',
	validate: new SimpleSchema({
		'giveawayId': {
			type: String,
			regEx: SimpleSchema.RegEx.Id,
			label: 'ID of Giveaway associated with this status update.'
		},
		'statusTypeId': {
			type: String,
			regEx: SimpleSchema.RegEx.Id,
			label: 'ID of Status.'
		},
		'date': {
			type: Date,
			label: 'Date that the status was set.'
		},
		'userId': {
			type: String,
			regEx: SimpleSchema.RegEx.Id,
			label: 'ID of User who updated this status.'
		},
	}).validator(),
	run(document) {
		StatusUpdates.insert(document);
	},
});
