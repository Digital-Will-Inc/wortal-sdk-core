import {Analytics} from "./analytics";
import {Wortal} from "../index";

export class DebugAnalytics implements Analytics {
    logGameChoice(decision: string, choice: string): void {
        Wortal.debug("Logged Game Choice: " + decision + " / " + choice);
    }

    logGameEnd(): void {
        Wortal.debug("Logged Game End.");
    }

    logGameStart(): void {
        Wortal.debug("Logged Game Start.");
    }

    logLevelEnd(level: string, score: string, wasCompleted: boolean): void {
        Wortal.debug("Logged Level End: " + level + " / " + score + " / " + wasCompleted);
    }

    logLevelStart(level: string): void {
        Wortal.debug("Logged Level Start: " + level);
    }

    logLevelUp(level: string): void {
        Wortal.debug("Logged Level Up: " + level);
    }

    logScore(score: string): void {
        Wortal.debug("Logged Score: " + score);
    }

    logTutorialEnd(tutorial: string): void {
        Wortal.debug("Logged Tutorial End: " + tutorial);
    }

    logTutorialStart(tutorial: string): void {
        Wortal.debug("Logged Tutorial Start: " + tutorial);
    }
}
