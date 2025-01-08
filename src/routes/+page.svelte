<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import * as m from '$lib/paraglide/messages';
	import type { ActionData, PageData } from './$types';
	import DiscordLogo from '$lib/DiscordLogo.svelte';
	import { page } from '$app/state';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let user = $derived(data.session?.user ?? null);
	let destination = $state(data.link?.to ?? '');

	let notfound = $derived(page.url.searchParams.get('notfound'));
	let disabled = $derived(page.url.searchParams.get('disabled'));
</script>

<svelte:head>
	<title>{m.title()}</title>
	<meta property="og:title" content={m.title()} />
	<meta property="og:description" content={m.tagline()} />
	<meta property="og:url" content="https://commission.now/" />
</svelte:head>

{#snippet url(url: string, classes?: string)}
	{#if user}
		<span class="font-mono {classes}">
			<span class="font-bold">{url}</span>.commission.now
		</span>
	{/if}
{/snippet}

<div class="absolute right-4 top-4">
	<button
		onclick={() => (data.session ? signOut() : signIn('discord'))}
		class="flex w-max items-center gap-2 rounded-md border-2 bg-white p-2 drop-shadow-md transition-all hover:bg-gray-200 active:drop-shadow-none dark:border-gray-400 dark:bg-gray-900 dark:hover:bg-gray-700 dark:active:bg-gray-600"
	>
		{#if !data.session}
			<DiscordLogo />
		{/if}
		<div class="mr-2" class:mx-2={data.session}>
			{#if data.session}
				{m.signout()}
			{:else}
				{m.signin({ service: 'Discord' })}
			{/if}
		</div>
	</button>
</div>

<div
	class="prose flex h-full w-full flex-col items-center justify-center px-4 text-center text-4xl dark:prose-invert sm:text-6xl md:text-8xl"
>
	<div>
		<span class="font-extrabold">commission</span><span>.now</span>
	</div>

	{#if notfound}
		<div class="text-xl text-red-800 dark:text-red-200">
			{m.info_start_notfound()}
			{@render url(notfound)}
			{m.info_end_notfound()}
		</div>
	{:else if disabled}
		<div class="text-xl text-red-800 dark:text-red-200">
			{m.info_start_disabled()}
			{@render url(disabled)}
			{m.info_end_disabled()}
		</div>
	{:else if user}
		{#snippet userurl(classes?: string)}
			{@render url(data.link?._id ?? user.username, classes)}
		{/snippet}
		{#if form?.created}
			<div class="text-lg text-green-800 dark:text-green-200">
				{m.enabled()}
				{@render userurl()}.
			</div>
		{:else if form?.disabled}
			<div class="text-lg text-yellow-800 dark:text-yellow-200">
				{m.disabled()}
				{@render userurl()}.
			</div>
		{:else if form?.released}
			<div class="text-lg text-red-800 dark:text-red-200">
				{m.released()}
				{@render userurl()}.
			</div>
		{:else if form?.updated}
			<div class="text-lg text-green-800 dark:text-green-200">
				{m.updated()}
				{@render userurl()}.
			</div>
		{:else}
			<div class="text-lg">
				{m.editing()}
				{@render userurl('text-blue-700 dark:text-blue-200')}
			</div>
		{/if}
	{:else}
		<div class="text-lg">{m.tagline()}</div>
	{/if}
	{#if user}
		{#snippet userurl(classes?: string)}
			{@render url(data.link?._id ?? user.username, classes)}
		{/snippet}

		<div class="flex flex-col items-center pt-16 text-base">
			<div>
				{m.welcome({ name: user.name })}
			</div>
			<form
				method="POST"
				action={data.link?.enabled ? '?/disable' : '?/set'}
				class="flex flex-col items-center"
			>
				<input
					name="destination"
					type="text"
					class="rounded-md dark:bg-gray-800"
					placeholder={m.linkto()}
					bind:value={destination}
				/>
				<button
					disabled={!data.link?.enabled && !destination}
					class="m-2 rounded-md border-2 bg-white p-2 drop-shadow-md transition-all hover:bg-gray-200 active:drop-shadow-none disabled:!text-gray-400 disabled:drop-shadow-none disabled:hover:bg-white dark:border-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 disabled:dark:!text-gray-600 dark:disabled:hover:bg-gray-800"
					class:text-yellow-800={data.link?.enabled}
					class:dark:text-yellow-200={data.link?.enabled}
				>
					<span>{data.link?.enabled ? m.disable_action() : m.enable_action()}</span>
					{@render userurl(
						'font-mono text-blue-800 dark:text-blue-200 hover:underline disabled:bg-gray-200'
					)}
				</button>
			</form>
			{#if data.link}
				<form method="POST" action="?/release" class="flex flex-col items-center">
					<button
						class="m-2 rounded-md border-2 bg-white p-2 text-red-800 drop-shadow-md transition-all hover:bg-gray-200 active:drop-shadow-none disabled:!text-gray-400 disabled:drop-shadow-none disabled:hover:bg-white dark:border-gray-400 dark:bg-gray-800 dark:text-red-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 disabled:dark:!text-gray-600 dark:disabled:hover:bg-gray-800"
					>
						<span>{m.release_action()}</span>
						{@render userurl('font-mono text-blue-800 dark:text-blue-200 hover:underline')}
					</button>
					<div class="text-xs">
						{m.release_help()}
					</div>
				</form>
			{/if}
		</div>
	{/if}
</div>
