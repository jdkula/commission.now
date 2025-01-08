import { db, type Redirect } from '$lib/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	let link: Redirect | null = null;

	if (session?.user?.id) {
		link = await db.redirects.findOne({ user_id: session.user.id });
	}

	return {
		link
	};
};

export const actions: Actions = {
	set: async (ev) => {
		const data = await ev.request.formData();
		const session = await ev.locals.auth();
		if (!session?.user?.id) {
			return { success: false };
		}

		let destination = data.get('destination')?.toString() ?? '';
		if (!destination.includes('://')) {
			destination = 'https://' + destination;
		}

		const result = await db.redirects.updateOne(
			{ user_id: session.user.id },
			{
				$set: {
					to: destination,
					enabled: true
				},
				$setOnInsert: {
					_id: session.user.username,
					user_id: session.user.id
				}
			},
			{ upsert: true }
		);

		return { created: result.upsertedCount > 0, updated: result.modifiedCount > 0 };
	},
	disable: async (ev) => {
		const session = await ev.locals.auth();
		if (!session?.user?.id) {
			return { success: false };
		}

		const res = await db.redirects.updateOne(
			{ user_id: session.user.id },
			{
				$set: {
					enabled: false
				}
			}
		);

		return { disabled: res.modifiedCount === 1 };
	},
	release: async (ev) => {
		const session = await ev.locals.auth();
		if (!session?.user?.id) {
			return { success: false };
		}

		const res = await db.redirects.deleteOne({ user_id: session.user.id });

		return { released: res.deletedCount === 1 };
	}
};
