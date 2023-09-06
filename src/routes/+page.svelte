<script lang="ts">
	import QRScanner from '$lib/components/QRScanner.svelte';
	import { scannerActive } from '$lib/stores';
	import { onMount } from 'svelte';
	import { API_URL } from '../constants';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import ScannedUser from '../lib/components/scanned-user.svelte';

	let emailInput = '';
	let netidInput = '';
	let messageToDisplay = '';
	let scannedEmails: string[] = [];
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

	const submitNetID = async () => {
		submitForm(netidInput, true);
	};

	const submitEmail = async () => {
		submitForm(emailInput, false);
	};

	const submitForm = async (input: string, isNetID: boolean) => {
		if (selectedEventId) {
			let emailInput = isNetID ? input + '@illinois.edu' : input;
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
				scannedEmails = [...scannedEmails, lastScannedUser?.email];
				messageToDisplay = '';
				if (scannedEmails.length > 5) {
					scannedEmails.shift();
				}
				if (isNetID) {
					netidInput = '';
				} else {
					emailInput = '';
				}
			} else {
				messageToDisplay = body.message;
			}
		} else {
			messageToDisplay = 'Please select an event before submitting the email.';
		}
	};

	onMount(async () => {
		const response = await fetch(`${$API_URL}/auth/access/admin`, {
			credentials: 'include',
			cache: 'no-cache'
		});
		if (!response.ok) {
			throw new Error('Something went wrong!');
		}

		if (response.status === 401) {
			window.location.href = 'https://reflectionsprojections.org/login';
		} else {
			goto('/');
		}

		const eventsResponse = await fetch(`${$API_URL}/events`);
		if (eventsResponse.ok) {
			const eventsData: EventData[] = await eventsResponse.json();
			eventOptions.set(eventsData);
		} else {
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
		if (last_scanned != decodedText) {
			const id = decodedText;
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
				scannedEmails = [...scannedEmails, lastScannedUser?.email];
				messageToDisplay = '';
				if (scannedEmails.length > 5) {
					scannedEmails.shift();
				}
			} else {
				messageToDisplay = body.message;
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
                <button on:click={toggleScanner} class="bg-pink-500 rounded-md p-3 text-white" disabled={selectedEventId == 0} class:disabled-button={selectedEventId == 0}>
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
                        <option value={0} selected>Select</option>
                        <!-- Initial text "Select" -->
                        {#each $eventOptions as event (event._id)}
                            <option value={event._id}>{event.name}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <div class="error-message">{messageToDisplay}</div>
            </div>

			<div>
                {#if (emailInput != '' && selectedEventId==0) || (netidInput != '' && selectedEventId==0) || (!scannerActive && (selectedEventId==0))}
				<div class="error-message">Please select an event before submitting the email.</div>
				{/if}
            </div>

            <div class="flex gap-2 mt-4">
                <input
                    placeholder="Enter netid manually"
                    type="netid"
                    id="netid"
                    class="bg-transparent p-1 border border-gray-400 rounded-md h-fit w-full"
                    bind:value={netidInput}
                />
                <div
                    class="bg-white bg-opacity-10 rounded-r-md py-1 border border-l-0 p-1 border-gray-400 pl-1 pr-2 w-fit"
                >
                    @illinois.edu
                </div>
                <button class="bg-pink-500 rounded-md p-1 pl-3 pr-3 text-white" on:click={submitNetID} disabled={selectedEventId == 0} class:disabled-button={selectedEventId == 0}>
                    Submit
                </button>
            </div>

            <div class="flex gap-2 mt-4">
                <input
                    placeholder="Enter email manually"
                    type="email"
                    id="email"
                    class="bg-transparent p-1 border border-gray-400 rounded-md h-fit w-full"
                    bind:value={emailInput}
                />
                <button class="bg-pink-500 rounded-md p-1 pl-3 pr-3 text-white" on:click={submitEmail} disabled={selectedEventId == 0}   class:disabled-button={selectedEventId == 0}>
                    Submit
                </button>
            </div>

            <div>
                {#if lastScannedUser}
                    <ScannedUser {...lastScannedUser} />
                    <br />
                    Last Scanned Emails:
                    <div class="email-box">
                        {#each scannedEmails as email (email)}
                            <div>{email}</div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
	.email-box {
		border: 2px solid #ccc; /* Border style and color */
		padding: 10px; /* Padding inside the box */
		border-radius: 8px; /* Rounded corners */
	}

	.error-message {
		color: red;
	}

	.disabled-button {
		background-color: #ff80ab; /* Pink color */
    color: #fff; /* White text color */
    opacity: 0.7; /* Reduce opacity to make it slightly grayed out */
    cursor: not-allowed; /* Change cursor to "not-allowed" */
    }
</style>
