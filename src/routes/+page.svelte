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
		class="flex w-max items-center gap-2 rounded-md border-2 bg-white p-2 drop-shadow-md transition-all hover:bg-gray-200 active:drop-shadow-none"
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
	class="prose flex h-full w-full flex-col items-center justify-center px-4 text-center text-4xl sm:text-6xl md:text-8xl"
>
	<div>
		<span class="font-extrabold">commission</span><span>.now</span>
	</div>

	{#if notfound}
		<div class="text-xl text-red-800">
			{m.info_start()}
			{@render url(notfound)}
			{m.info_end_notfound()}
		</div>
	{:else if disabled}
		<div class="text-xl text-red-800">
			{m.info_start()}
			{@render url(disabled)}

			{m.info_end_disabled()}
		</div>
	{:else if user}
		{#snippet userurl(classes?: string)}
			{@render url(data.link?._id ?? user.username, classes)}
		{/snippet}
		{#if form?.created}
			<div class="text-lg text-green-800">
				{m.enabled()}
				{@render userurl()}.
			</div>
		{:else if form?.disabled}
			<div class="text-lg text-yellow-800">
				{m.disabled()}
				{@render userurl()}.
			</div>
		{:else if form?.released}
			<div class="text-lg text-red-800">
				{m.released()}
				{@render userurl()}.
			</div>
		{:else if form?.updated}
			<div class="text-lg text-green-800">
				{m.updated()}
				{@render userurl()}.
			</div>
		{:else}
			<div class="text-lg">
				{m.editing()}
				{@render userurl('text-blue-700')}
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
					class="rounded-md"
					placeholder={m.linkto()}
					bind:value={destination}
				/>
				<button
					disabled={!data.link?.enabled && !destination}
					class="m-2 rounded-md border-2 bg-white p-2 drop-shadow-md transition-all hover:bg-gray-200 active:drop-shadow-none disabled:!text-gray-400 disabled:drop-shadow-none disabled:hover:bg-white"
					class:text-yellow-800={data.link?.enabled}
				>
					<span>{data.link?.enabled ? m.disable_action() : m.enable_action()}</span>
					{@render userurl('font-mono text-blue-800 hover:underline disabled:bg-gray-200')}
				</button>
			</form>
			{#if data.link}
				<form method="POST" action="?/release" class="flex flex-col items-center">
					<button
						class="m-2 rounded-md border-2 bg-white p-2 text-red-800 drop-shadow-md transition-all hover:bg-gray-200 active:drop-shadow-none"
					>
						<span>{m.release_action()}</span>
						{@render userurl('font-mono text-blue-800 hover:underline')}
					</button>
					<div class="text-xs">
						{m.release_help()}
					</div>
				</form>
			{/if}
		</div>
	{/if}
</div>
