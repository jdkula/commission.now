import type { DefaultSession } from '@auth/sveltekit';

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			username: string;
      name: string;
      id: string;
		} & Omit<DefaultSession['user'], 'name' | 'id'>;
	}
}
