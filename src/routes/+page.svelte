<script lang="ts">
	import { Sound } from "svelte-sound";
	import success_mp3 from "../success.mp3";
	import QRScanner from '$lib/components/QRScanner.svelte';
	import { scannerActive, scannerFrontFacing } from '$lib/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { API_URL } from '../constants';
	import dayjs from 'dayjs';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.tz.setDefault('America/Chicago');
	import ScannedUser from '../lib/components/scanned-user.svelte';
	import Icon from '@iconify/svelte';

	const click_sound = new Sound(success_mp3);
	function playSound() {
		click_sound.play();
	}

	let emailInput = '';
	let netIdInput = '';
	let messageToDisplay = '';
	let scannedEmails: string[] = [];
	let selectedEvent: EventData | null = null;
	const eventOptions = writable<EventData[]>([]);

	interface EventData {
		_id: string;
		name: string;
		start_time: string;
		upgrade: boolean;
		downgrade: boolean;
	}

	interface User {
		email: string;
		name: string;
		priority: boolean;
		prior_check_in: boolean;
	}

	let lastScannedUser: User | null = null;
	const submitNetID = async () => {
		submitForm(netIdInput + '@illinois.edu');
	};

	const submitEmail = async () => {
		submitForm(emailInput);
	};

	const submitForm = async (email: string) => {
		if (selectedEvent) {
			const response = await fetch(`${$API_URL}/events/${selectedEvent._id}/attendee/email`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
				credentials: 'include'
			});

			const body = await response.json();
			if (response.ok) {
				playSound();
				lastScannedUser = body;
				clearLastUser();
				vibrate(true);
				if (lastScannedUser) scannedEmails = [...scannedEmails, lastScannedUser?.email];
				messageToDisplay = '';
				if (scannedEmails.length > 5) {
					scannedEmails.shift();
				}
				netIdInput = '';
				emailInput = '';
			} else {
				vibrate(false);
				messageToDisplay = body.message;
			}
		} else {
			messageToDisplay = 'Please select an event before submitting the email.';
		}
	};

	onMount(async () => {
		const eventsResponse = await fetch(`${$API_URL}/events`, {
			credentials: 'include',
			cache: 'no-cache'
		});
		if (eventsResponse.ok) {
			const eventsData: EventData[] = await eventsResponse.json();
			eventsData.sort((e1, e2) => (dayjs(e1.start_time).isBefore(e2.start_time) ? -1 : 1));
			eventOptions.set(eventsData);
		} else {
			messageToDisplay = 'Failed to fetch events.';
		}
	});

	const toggleScanner = () => {
		scannerActive.set(!$scannerActive);
	};

	const toggleFrontFacing = () => {
		scannerFrontFacing.set(!$scannerFrontFacing);
	};

	let last_scanned: string | null = null;

	const successCallback = async (decodedText: string) => {
		if (!selectedEvent || last_scanned == decodedText) {
			return;
		}
		const response = await fetch(`${$API_URL}/events/${selectedEvent._id}/attendance/qr`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: decodedText }),
			credentials: 'include'
		});

		const body = await response.json();
		if (response.ok) {
			lastScannedUser = body;
      playSound();
			clearLastUser();
			vibrate(true);
			last_scanned = decodedText;
			if (lastScannedUser) scannedEmails = [...scannedEmails, lastScannedUser.email];
			messageToDisplay = '';
			if (scannedEmails.length > 5) {
				scannedEmails.shift();
			}
		} else {
			vibrate(false);
			messageToDisplay = body.message;
		}
	};

	const clearLastUser = () => {
		setTimeout(() => (lastScannedUser = null), 3000);
	};

	const vibrate = (success: boolean) => {
		navigator.vibrate(success ? [300] : [200, 100, 200]);
	};
</script>

<div class="flex flex-col md:flex-row items-center content-center gap-10 m-3 my-5">
	<QRScanner {successCallback} />

	<div class="flex flex-col">
		{#key lastScannedUser}
			{#if lastScannedUser}
				<ScannedUser {...lastScannedUser} />
			{/if}
		{/key}

		<div class="flex flex-col gap-3 items-center md:items-start">
			<div class="flex flex-col md:flex-row gap-3 items-center">
				<button
					on:click={toggleScanner}
					class="bg-pink-500 rounded-md p-3 text-white disabled:bg-pink-800 disabled:cursor-not-allowed"
					disabled={!selectedEvent}
				>
					{$scannerActive ? 'Stop Scanning' : 'Start Scanning'}
				</button>
				<button
					on:click={toggleFrontFacing}
					class="bg-rp-blue rounded-md p-3 text-white disabled:bg-black disabled:cursor-not-allowed"
					disabled={!$scannerActive}
				>
					{$scannerFrontFacing ? 'Switch to Rear Facing' : 'Switch to Front Facing'}
				</button>
			</div>
			<div class="flex flex-col">
				<label for="event" class="font-semibold">Select Event</label>
				<span class="flex flex-row items-center">
					{#if selectedEvent?.upgrade}
						<Icon
							icon="mdi:arrow-up-bold"
							class="text-2xl mx-auto text-green-500"
							title="upgrades"
						/>
					{:else if selectedEvent?.downgrade}
						<Icon
							icon="mdi:arrow-down-bold"
							class="text-2xl mx-auto text-orange-500"
							title="downgrades"
						/>
					{:else}
						<Icon
							icon="radix-icons:dash"
							class="text-2xl mx-auto text-gray-800"
							title="no change"
						/>
					{/if}
					<select
						id="event"
						class="border border-gray-300 p-2 rounded-md shadow-md max-w-[20rem] md:max-w-sm"
						bind:value={selectedEvent}
					>
						<option value={null} selected>Select</option>
						{#each $eventOptions as event (event._id)}
							<option value={event}>
								{event.name}
								on
								{dayjs(event.start_time).format('ddd M/D h:mm A')}
							</option>
						{/each}
					</select>
				</span>
			</div>
		</div>
		<div class="flex gap-2 mt-4">
			<div class="text-red-500">{messageToDisplay}</div>
		</div>

		<div>
			{#if (emailInput != '' && !selectedEvent) || (netIdInput != '' && !selectedEvent) || (!scannerActive && !selectedEvent)}
				<div class="text-red-500">Please select an event before submitting the email.</div>
			{/if}
		</div>

		<div class="flex gap-2 mt-4">
			<span class="flex flex-row">
				<input
					placeholder="Enter NetID"
					type="netid"
					id="netid"
					class="bg-transparent p-1 border border-gray-400 rounded-l-md h-fit w-full"
					bind:value={netIdInput}
				/>
				<div class="bg-transparent rounded-r-md border border-l-0 p-1 pr-2 border-gray-400 w-fit">
					@illinois.edu
				</div>
			</span>
			<button
				class="bg-pink-500 rounded-md p-1 pl-3 pr-3 text-white disabled:bg-pink-800 disabled:cursor-not-allowed"
				on:click={submitNetID}
				disabled={!selectedEvent}
			>
				Submit
			</button>
		</div>

		<div class="flex gap-2 mt-4">
			<input
				placeholder="Enter email"
				type="email"
				id="email"
				class="bg-transparent p-1 border border-gray-400 rounded-md h-fit w-full"
				bind:value={emailInput}
			/>
			<button
				class="bg-pink-500 rounded-md p-1 pl-3 pr-3 text-white disabled:bg-pink-800 disabled:cursor-not-allowed"
				on:click={submitEmail}
				disabled={!selectedEvent}
			>
				Submit
			</button>
		</div>

		{#if scannedEmails.length > 0}
			<div class="flex flex-col mt-4 mb-2" in:slide>
				<h1 class="text-lg font-serif font-bold">Last Scanned Emails</h1>
				<ul class="p-1 flex flex-col gap-1">
					{#each scannedEmails as email (email)}
						<li>{email}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
