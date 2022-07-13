import type { events, tasks, teams, UnixSecondsTS } from "./remoteTypes";

export type JudgingResult =
    | "OK"
    | "RE"
    | "WA"
    | "TLE"
    | "MLE"
    | "SE"
    | "CE"
    | "??";

export const resultPenalised: Record<JudgingResult, number> = {
    OK: 0,
    RE: 1,
    WA: 1,
    TLE: 1,
    MLE: 1,
    SE: 0,
    CE: 0,
    "??": 0,
};

export const BOMB_PENALTY: UnixSecondsTS = 20 * 60;

export class Task {
    shortName: string;
    id: number;
    name: string;
    results: Record<JudgingResult, number>;
    constructor({ shortName, id, name }) {
        this.shortName = shortName;
        this.id = id;
        this.name = name;
        this.results = {
            OK: 0,
            RE: 0,
            WA: 0,
            TLE: 0,
            MLE: 0,
            SE: 0,
            CE: 0,
            "??": 0,
        };
    }
    addResult(result: JudgingResult) {
        this.results[result]++;
    }
}

export class TeamResult {
    result: "" | JudgingResult = "";
    attempts: number = 0;
    bombs: number = 0;
    timestamp: UnixSecondsTS = 0;
}

export class Team {
    id: number;
    rank: number = 0;
    login: string;
    name: String;
    photo: string;
    score: number = 0;
    penalty: UnixSecondsTS = 0;
    results: Record<Task["id"], TeamResult>;
    constructor({ login, id, name, photo }, tasksJson: tasks.Task[]) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.photo = photo;
        this.results = {};
        for (const task of tasksJson) {
            this.results[task.id] = new TeamResult();
        }
    }
}

export function buildRanking(events: events.Event[], tasksJson: tasks.Task[], teamsJson: teams.Team[]): Team[] {
    const teams: Record<number, Team> = {};
    const tasks: Record<number, Task> = {};
    for (const task of tasksJson) {
        tasks[task.id] = new Task(task);
    }
    for (const team of teamsJson) {
        teams[team.id] = new Team({ photo: `${team.login}.jpg`, ...team }, tasksJson);
    }
    const start = events[0].judgingTimestamp;
    for (const ev of events) {
        if (ev.result == "CTRL") continue;
        const submission: events.SubmissionEvent = ev;
        const submission_time = submission.submissionTimestamp - start;
        if (submission.result == "FROZEN") submission.result = "??";
        if (submission.result == "TESTRUN") continue;
        const team = teams[submission.teamId];
        const teamResult = team.results[submission.taskId];
        if (teamResult.result == "OK") continue;
        teamResult.attempts += 1;
        teamResult.bombs += resultPenalised[submission.result];
        teamResult.result = submission.result;
        teamResult.timestamp = submission.submissionTimestamp;
        if (submission.result == "OK") {
            team.score += 1;
            team.penalty +=
                submission_time + teamResult.bombs * BOMB_PENALTY;
        }
    }
    const ranking = Object.values(teams);
    ranking.sort((a, b) => {
        const scoreCmp = b.score - a.score;
        if (scoreCmp != 0) return scoreCmp;
        const penaltyCmp = a.penalty - b.penalty;
        if (penaltyCmp != 0) return penaltyCmp;
        return a.id - b.id;
    });
    for (const [idx, team] of ranking.entries()) {
        team.rank = idx + 1;
    }
    return ranking;
}