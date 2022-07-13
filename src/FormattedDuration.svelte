<script type="ts">
    import type { UnixSecondsTS } from "./remoteTypes";

    export let duration: UnixSecondsTS;

    let seconds: number;
    let minutes: number;
    let hours: number;

    $: seconds = duration % 60;
    $: minutes = (duration - seconds) / 60 % 60;
    $: hours = ((duration - seconds) / 60 - minutes) / 60;
</script>

{hours < 10 ? "0" : ""}{hours}:{minutes < 10 ? "0" : ""}{minutes}:{seconds < 10 ? "0" : ""}{seconds}
