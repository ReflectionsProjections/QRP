<script lang="ts">
	import QRScanner from '$lib/components/QRScanner.svelte';
	import { scannerActive } from '$lib/stores';
	import { onMount } from 'svelte';
	import { API_URL } from '../constants';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import ScannedUser from '../lib/components/scanned-user.svelte';

	let emailInput = '';
	const scannedEmails = [];
	let selectedEventId = 0;
	const eventOptions = writable<EventData[]>([]);

	interface EventData {
		_id: string;
		name: string;
	}

	interface User {
		email: string;
		name: string;
		priority: boolean;
	}

	let lastScannedUser: User | null = null;

	const submitEmail = async () => {
		if (selectedEventId) {
			const apiURL = `${$API_URL}/events/${selectedEventId}/attendee/email`;
			const requestBody = {
				email: emailInput
			};

			const response = await fetch(apiURL, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody),
				credentials: 'include'
			});

			const body = await response.json();
			if (response.ok) {
				lastScannedUser = body;
			} else {
				console.error(body.message);
				console.error(response.status, response.statusText);
			}
		} else {
			console.log('Please select an event before submitting the email.');
		}
	};

	onMount(async () => {
		const response = await fetch(`${$API_URL}/auth/access/admin`, {
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

		const eventsResponse = await fetch(`${$API_URL}/events`);
		if (eventsResponse.ok) {
			const eventsData: EventData[] = await eventsResponse.json();
			eventOptions.set(eventsData);
		} else {
			console.error(eventsResponse.status, eventsResponse.body);
			throw new Error('Failed to fetch events.');
		}
	});

	const toggleScanner = () => {
		scannerActive.set(!$scannerActive);
	};

	let last_scanned: string | null = null;

	const successCallback = async (decodedText: string) => {
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
			const apiURL = `${$API_URL}/events/${selectedEventId}/attendance/qr`;
			const registerAttendeeDto = {
				token: id
			};

			const response = await fetch(apiURL, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(registerAttendeeDto),
				credentials: 'include'
			});

			const body = await response.json();
			if (response.ok) {
				lastScannedUser = body;
				last_scanned = decodedText;
			} else {
				console.error(body.message);
				console.error(response.status, response.statusText);
			}
		}
	};
</script>

<div>
	<br />

	<div class="flex flex-col md:flex-row items-center content-center gap-10 m-3">
		<QRScanner {successCallback} />

		<div class="flex flex-col">
			<div class="flex flex-col md:flex-row gap-3 items-center">
				<button on:click={toggleScanner} class="bg-pink-500 rounded-md p-3 text-white">
					{$scannerActive ? 'Stop Scanning' : 'Start Scanning'}
				</button>
				<div class="m-3 flex flex-col">
					<label for="event" class="font-semibold">Select Event</label>
					<select
						id="event"
						class="border border-gray-300 p-2 rounded-md shadow-md"
						bind:value={selectedEventId}
					>
						<!-- Bind selectedEventId to the dropdown value -->
						<option value="" selected>Select</option>
						<!-- Initial text "Select" -->
						{#each $eventOptions as event (event._id)}
							<option value={event._id}>{event.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="flex gap-2 mt-4">
				<input
					placeholder="Enter email manually"
					type="email"
					id="email"
					class="border border-gray-300 p-2 rounded-md shadow-md"
					bind:value={emailInput}
				/>
				<button class="bg-pink-500 rounded-md p-3 text-white" on:click={submitEmail}>
					Submit
				</button>
			</div>

			{#if lastScannedUser}
				<ScannedUser {...lastScannedUser} />
			{/if}
		</div>
	</div>
</div>
