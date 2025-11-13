import { errors } from '@strapi/utils';

const { ValidationError } = errors;

export default {
	async beforeCreate(event) {
		const data = event?.params?.data;
		if (!data) return;

		if (!data.email) {
			throw new ValidationError('Email is required.');
		}

		data.email = String(data.email).trim().toLowerCase();

		const existing = await strapi.db
			.query('api::news-letter-subscription.news-letter-subscription')
			.findOne({
				where: { email: data.email, publishedAt: { $notNull: true } },

			});

		if (existing) {
			throw new ValidationError('This email is already subscribed.xxxxxxxxxxx');
		}
	},
};
