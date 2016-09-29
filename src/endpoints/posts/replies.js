'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import serialize from '../../serializers/post';

/**
 * Show a replies of a post
 *
 * @param {Object} params
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
{
	const postId = params.id;
	if (postId === undefined || postId === null) {
		return reply(400, 'id is required', 'EMPTY_QUERY');
	}

	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (!(1 <= limit && limit <= 100)) {
			return reply(400, 'invalid limit range');
		}
	} else {
		limit = 10;
	}

	// Init 'offset' parameter
	let offset = params.offset;
	if (offset !== undefined && offset !== null) {
		offset = parseInt(offset, 10);
	} else {
		offset = 0;
	}

	// Init 'sort' parameter
	let sort = params.sort || 'desc';

	// Lookup post
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return reply(404, 'post not found', 'POST_NOT_FOUND');
	}

	// クエリ発行
	const replies = await Post
		.find({ reply_to: post._id }, {}, {
			limit: limit,
			skip: offset,
			sort: {
				_id: sort == 'asc' ? 1 : -1
			}
		})
		.toArray();

	if (replies.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(replies.map(async post =>
		await serialize(post))));
};
