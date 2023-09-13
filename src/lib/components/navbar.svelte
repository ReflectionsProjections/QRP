<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<span class="absolute top-0 w-full">
	<div
		class="flex flex-row justify-between p-5 text-gray-200 text-md md:text-base lg:text-lg font-sans items-center"
	>
		<a href="/" class="flex flex-row items-center gap-5">
			<img
				src="favicon.png"
				alt="Reflections Projections Home Page"
				class="hover:rotate-180 duration-500 hover:scale-125 h-[40px] w-[40px] md:h-[50px] md:w-[50px]"
			/>
		</a>

		<div class="flex flex-row gap-3 items-center text-gray-900">
			<div class="hidden md:flex">Welcome to QR|P</div>
			<a href="https://reflectionsprojections.org/preferences">
				<Icon
					icon="fluent:person-28-filled"
					class="text-xl md:text-3xl hover:text-pink-500 duration-200"
				/>
			</a>
		</div>
	</div>
</span>
