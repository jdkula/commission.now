import { db } from '$lib/db';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const redir = await db.redirects.findOne({ _id: params.slug });
	if (!redir) {
		return redirect(302, '/?notfound=' + encodeURIComponent(params.slug!));
	}
	if (!redir.enabled) {
		return redirect(302, '/?disabled=' + encodeURIComponent(params.slug!));
	}
	return redirect(302, redir.to);
};
