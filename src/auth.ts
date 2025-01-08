import { mongo } from '$lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import Discord from '@auth/sveltekit/providers/discord';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Discord({
			profile: (profile) => {
				return {
					id: profile.id,
					username: profile.username,
					discriminator: profile.discriminator,
					name: profile.global_name,
					locale: profile.locale
				};
			}
		})
	],
	callbacks: {
		session: (params) => {
			return {
				expires: params.session.expires,
				user: { ...params.user, email: undefined, emailVerified: undefined }
			};
		}
	},
	adapter: MongoDBAdapter(mongo, {
		databaseName: 'commission_now',
		collections: {
			Accounts: 'auth_accounts',
			Sessions: 'auth_sessions',
			Users: 'auth_users',
			VerificationTokens: 'auth_verification_tokens'
		}
	})
});
