<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	export let email: string;
	export let name: string;
	export let priority: boolean;
</script>

<div
	class="flex flex-row gap-5 {priority
		? 'bg-yellow-500'
		: 'bg-green-600'} p-5 my-2 text-white rounded-full items-center"
	in:fade
	out:fade
>
	{#if priority}
		<Icon icon="solar:star-bold" class="text-white text-2xl" />
	{:else}
		<Icon icon="simple-line-icons:check" class="text-white text-2xl" />
	{/if}
	<div class="flex flex-col gap-1">
		<p>{name}</p>
		<p class="text-sm">{email}</p>
	</div>
</div>
