import { error } from '@sveltejs/kit';
import { API_URL } from '../constants';
import type { PageLoad } from './$types';
import { get } from 'svelte/store';

export const load: PageLoad<void> = async ({ fetch }) => {
	const url = get(API_URL);
	const check = await fetch(`${url}/auth/access/admin`, {
		credentials: 'include'
	});

	if (check.status == 403 || check.status == 401) {
		throw error(check.status, { message: check.statusText });
	}
};

export const ssr = false;
