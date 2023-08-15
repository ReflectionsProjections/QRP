<script lang="ts">
	import QRScanner from '$lib/components/QRScanner.svelte';
	import { scannerActive } from '$lib/stores';
	import { onMount } from 'svelte';

	let email_manual = '';

	const submitEmail = () => {
		// Store the entered email in the email_manual variable
		alert('Email Submitted');
		console.log('Entered Email:', email_manual);
		email_manual = '';
	};

	onMount(async () => {
		fetch('http://localhost:3000/auth/me', {
			method: 'GET', // or 'POST', 'PUT', etc.
			headers: {
				'Content-Type': 'application/json'
				// Other headers...
			},
			credentials: 'include'
		}) // Add this line to include credentials)
			.then((response) => {
				if (response.status === 401) {
					console.log('Unauthorized. Redirecting to login page...');
					window.location.href = 'https://reflectionsprojections.org/login';
					//navigate("/login-generate")
					//window.location.href = './components/login-generate/login-page.svelte'; // Redirect to the login page
				} else if (response.ok) {
					console.log('Response OK');
				} else {
					console.log('Response not OK. Redirecting to login page...');
					//navigate("/login-generate") // Redirect to the login page
				}
			})
			.catch((error) => {
				console.error('An error occurred:', error);
			});
	});

	const toggleScanner = () => {
		scannerActive.set(!$scannerActive);
	};

	let last_scanned = '';

	const successCallback = (decodedText: string) => {
		// TODO: Call RP-core API
		// fetch('/scanevent')
		console.log(decodedText);
		if (last_scanned != decodedText) {
			/*try {
                  await fetch("http://localhost:8080/scan", {
                      method: "POST",
                      mode: 'cors',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({"data": result.data}),
                  });    
                  console.log('Success:', result.data);
                  console.log("Last scanned value: ", last_scanned);
              } catch (e) {
                  console.error("QR Code data is bad or cannot be scanned");
                  last_scanned = "";
  
                  console.log('Error', e);
              }*/
			console.log('decoded id:' + decodedText);
			const id = decodedText;
			const apiURL = 'http://localhost:3000/events/' + id + '/attendee';
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
</div>
<br />
{#if last_scanned !== ''}
	<div class="m-3 pl-10">
		<label for="last-scanned" class="text-lg font-semibold">Last Scanned ID:</label>
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
			class="border border-gray-300 p-2 rounded-md shadow-md"
			bind:value={email_manual}
		/>
		<button class="bg-pink-500 rounded-md p-3 text-white" on:click={submitEmail}> Submit </button>
	</div>
</div>

<style>
	/* Additional styling */
	.shadow-box {
		background-color: #f7fafc; /* Set your preferred background color */
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Adjust shadow settings */
		width: 30vw; /* 10% of viewport width */
		padding: 10px; /* Adjust padding as needed */
		border-radius: 5px; /* Adjust border radius as needed */
	}
</style>
