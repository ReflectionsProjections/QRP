<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
</script>

<Navbar />
<main class="absolute top-20 w-screen">
	<slot />
</main>
