<script lang="ts">
	import QRScanner from '$lib/components/QRScanner.svelte';
	import { scannerActive } from '$lib/stores';
	import { onMount } from 'svelte';
	import { API_URL } from '../constants';
	import { goto } from '$app/navigation';

	let emailInput = '';
	const scannedEmails = [];

	const submitEmail = () => {
		console.log('Entered Email:', emailInput);
		emailInput = '';
	};

	onMount(async () => {
		const response = await fetch(`${$API_URL}/access/admin`, {
			credentials: 'include',
			cache: 'no-cache'
		});
		if (!response.ok) {
			console.error(response.status, response.body);
			throw new Error('Something went wrong!');
		}

		if (response.status === 401) {
			console.log('Unauthorized. Redirecting to login page...');
			window.location.href = 'https://reflectionsprojections.org/login';
		} else {
			goto('/');
		}
	});

	const toggleScanner = () => {
		scannerActive.set(!$scannerActive);
	};

	let last_scanned: string | null = null;

	const successCallback = (decodedText: string) => {
		// == PLEASE READ ==
		// It CANNOT be decrypted client-side (in QRP), only in rp-core!
		// Currently looked into this and found our that the rp-core endpoint currently does not support this.
		// Will add the following endpoints:
		// PUT /events/:eventId/attendee/email
		//    --> body: { email: "attendee@email.com" }
		// PUT /events/:eventId/attendance/qr
		//    --> body: { token: decodedText }
		console.log(decodedText);
		if (last_scanned != decodedText) {
			console.log('decoded id:' + decodedText);
			const id = decodedText;
			// == PLEASE READ ==
			// Note: This fetch call is wrong because the id refers to event id.
			// You'l need to fetch a list of events from GET /events and add a dropdown selector in QRP
			// to select a particular event.
			const apiURL = `${$API_URL}/events/${id}/attendee`;
			const registerAttendeeDto = {
				id: id
			};
			const requestOptions = {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(registerAttendeeDto)
			};

			fetch(apiURL, requestOptions)
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					last_scanned = decodedText;
					console.log('Yay worked!');
				})
				.catch((error) => {
					console.error('Error', error);
				});
		}
	};
</script>

<div class="flex flex-col md:flex-row items-center content-center gap-10 m-3">
	<QRScanner {successCallback} />
	<button on:click={toggleScanner} class="bg-pink-500 rounded-md p-3 text-white">
		{$scannerActive ? 'Stop Scanning' : 'Start Scanning'}
	</button>

	<div class="flex flex-col">
		{#if last_scanned}
			<div class="m-3 pl-10">
				<div class="text-lg font-semibold">Last Scanned ID:</div>
				<div class="shadow-box">
					<span class="text-xl">{last_scanned}</span>
				</div>
			</div>
		{/if}
		<div class="m-3 pl-10">
			<label for="email" class="text-lg font-semibold">Enter Email:</label>
			<div class="flex gap-2">
				<input
					type="email"
					id="email"
					class="border border-gray-300 p-2 rounded-md shadow-md"
					bind:value={emailInput}
				/>
				<button class="bg-pink-500 rounded-md p-3 text-white" on:click={submitEmail}>
					Submit
				</button>
			</div>
		</div>
	</div>
</div>
