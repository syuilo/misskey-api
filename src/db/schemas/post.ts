import {Schema, Connection, Document, Model} from 'mongoose';

const schema = new Schema({
	created_at: { type: Date, required: true,  default: Date.now },
	files:      { type: [Schema.Types.ObjectId], required: false, default: null, ref: 'DriveFile' },
	next:       { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	prev:       { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	reply_to:   { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	text:       { type: String, required: false, default: null },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default function(db: Connection): Model<Document> {
	return db.model('Post', schema, 'posts');
}
