type UnixSecondsTS = number;

export namespace events {
    export interface SubmissionEvent {
        judgingTimestamp: UnixSecondsTS,
        submissionTimestamp: UnixSecondsTS,
        teamId: number,
        reportId: number,
        taskId: number,
        submissionId: number,
        result: "FROZEN" | "TESTRUN" | "OK" | "RE" | "WA" | "TLE" | "MLE" | "SE" | "CE" | "??",
    }

    export interface StartEvent {
        submissionId: "START",
        reportId: "START",
        teamId: "START",
        taskId: "START",
        submissionTimestamp: UnixSecondsTS,
        judgingTimestamp: UnixSecondsTS,
        result: "CTRL",
    }

    export type Event = SubmissionEvent | StartEvent;
}

export namespace teams {
    export interface Team {
        login: string;
        id: number;
        name: string;
    }
}

export namespace tasks {
    export interface Task {
        shortName: string;
        id: number;
        name: string;
    }
}