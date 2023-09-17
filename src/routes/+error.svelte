<script lang="ts">
	import { page } from '$app/stores';
	console.error($page.status, $page.error?.message);
</script>

<div class="flex flex-col justify-center items-center">
	<h1 class="text-black text-4xl font-serif p-5">{$page.status}</h1>
	<h1 class="text-2xl font-serif p-5 text-black">
		{$page.error?.message}
	</h1>
</div>
