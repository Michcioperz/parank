import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		contest: 'pa-2021-2',
		round: 511,
		mode: "loopingReplay",
	}
});

export default app;