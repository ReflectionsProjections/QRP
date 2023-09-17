import { error } from '@sveltejs/kit';
import { API_URL } from '../constants';
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const load: PageLoad<void> = async ({ fetch }) => {
	let check;
	try {
		check = await fetch(`${get(API_URL)}/auth/access/admin`, {
			credentials: 'include',
			cache: 'no-cache'
		});
	} catch (e) {
		console.error(e);
		throw error(500, String(e));
	}
	if (check?.status == 403 || check?.status == 401) {
		throw redirect(
			301,
			env.PUBLIC_STAGE === 'staging'
				? 'https://beta.reflectionsprojections.org/login'
				: 'https://reflectionsprojections.org/login'
		);
	}
};

export const ssr = false;
