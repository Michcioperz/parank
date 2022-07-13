<script lang="ts">
    import { onMount } from "svelte";
    import type { events, tasks, teams } from "./remoteTypes";
    import { buildRanking, Team } from "./model";
    import Ranking from "./Ranking.svelte";

    export let contest: string;
    export let round: number;
    export let mode: "live" | "replay" | "loopingReplay" = "live";

    let tasksJson: tasks.Task[] | undefined = undefined;
    let teamsJson: teams.Team[] | undefined = undefined;
    let ranking: Team[] | undefined = undefined;

    async function fetchEvents(): Promise<events.Event[]> {
        const response = await fetch(
            `https://sio2.mimuw.edu.pl/c/${contest}/events/${round}/`
        );
        const submissions: events.Event[] = await response.json();
        return submissions;
    }

    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    onMount(async () => {
        tasksJson = await (
            await fetch(
                `https://sio2.mimuw.edu.pl/c/${contest}/tasks/${round}/`
            )
        ).json();
        teamsJson = await (
            await fetch(
                `https://sio2.mimuw.edu.pl/c/${contest}/teams/${round}/`
            )
        ).json();
        switch (mode) {
            case "live":
                while (true) {
                    const timeline = await fetchEvents();
                    ranking = buildRanking(timeline, tasksJson, teamsJson);
                    await sleep(15000);
                }
            case "loopingReplay":
            case "replay":
                do {
                    const timeline = await fetchEvents();
                    const currentState: events.Event[] = [];
                    for (let i = 0; i < timeline.length; i += 1) {
                        currentState.push(timeline[i]);
                        ranking = buildRanking(
                            currentState,
                            tasksJson,
                            teamsJson
                        );
                        await sleep(1000);
                    }
                } while (mode == "loopingReplay");
                break;
        }
    });
</script>

{#if tasksJson === undefined}
    Fetching tasks
{:else if teamsJson === undefined}
    Fetching teams
{:else if ranking === undefined}
    Fetching ranking
{:else}
    <Ranking {ranking} {tasksJson} />
{/if}
