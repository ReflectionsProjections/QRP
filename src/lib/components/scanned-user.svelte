<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	export let email: string;
	export let name: string;
	export let priority: boolean;
	export let prior_check_in: boolean;
</script>

<div
	class="flex flex-row gap-5
		p-5 my-2 text-white rounded-full items-center {prior_check_in
		? 'bg-red-500'
		: priority
		? 'bg-yellow-500'
		: 'bg-green-600'} "
	in:slide
	out:slide
>
	{#if priority}
		<Icon icon="solar:star-bold" class="text-white text-2xl" />
	{:else}
		<Icon icon="simple-line-icons:check" class="text-white text-2xl" />
	{/if}
	<div class="flex flex-col gap-1">
		<p>{name} {prior_check_in ? '[Checked In Previously]' : ''}</p>
		<p class="text-sm">{email}</p>
	</div>
</div>
