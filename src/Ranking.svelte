<script lang="ts">
	import { scale } from "svelte/transition";
	import { cuteFlip } from "./cuteness";
	import FormattedDuration from "./FormattedDuration.svelte";
	import type { Team } from "./model";
	import type { tasks } from "./remoteTypes";

	export let ranking: Team[] = [];
	export let tasksJson: tasks.Task[] = [];
</script>

<table>
	<thead>
		<tr>
			<th>#</th>
			<th>Name</th>
			<th>Score</th>
			<th>Time</th>
			{#each tasksJson as task}
				<th>{task.shortName}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each ranking as row (row.id)}
			<tr animate:cuteFlip>
				<td class="rank">{row.rank}.</td>
				<td>{row.name}</td>
				<td>{row.score}</td>
				<td><FormattedDuration duration={row.penalty} /></td>
				{#each tasksJson as task}
					{@const teamTask = row.results[task.id]}
					<td class="teamtask" data-result={teamTask.result}>
						{#key teamTask.attempts}
							<span in:scale>
								{teamTask.result}{#if teamTask.bombs > 0}({teamTask.bombs}){/if}
							</span>
						{/key}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.rank {
		text-align: right;
	}
	table {
		border-collapse: collapse;
	}
	tbody tr {
		border: 0.2em solid black;
		background-color: yellow;
		color: black;
	}
	.teamtask {
		transition: background 400ms, color 400ms;
		width: 6ch;
		text-align: center;
		background-color: white;
		color: black;
	}
	.teamtask[data-result="OK"] {
		background: limegreen;
	}
	.teamtask[data-result="??"] {
		background: turquoise;
	}
	.teamtask[data-result="WA"] {
		background: crimson;
	}
	.teamtask[data-result="RE"], .teamtask[data-result="MLE"] {
		background: yellow;
	}
	.teamtask[data-result="CE"] {
		background: black;
		color: white;
	}
	.teamtask[data-result="TLE"] {
		background: blue;
		color: white;
	}
</style>
