import { writable } from 'svelte/store';

export const scannerActive = writable<boolean>(false);
export const scannerFrontFacing = writable<boolean>(false);
