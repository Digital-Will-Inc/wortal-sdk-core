import {Analytics} from "./analytics";
import {Wortal} from "../index";

export class WortalAnalytics implements Analytics {
    logGameStart(): void {
        this.logEvent("GameStart", {
            gameId: Wortal.data.gameId,
            gameName: Wortal.data.gameName,
            platform: Wortal.data.platform,
            browser: Wortal.data.browser,
            country: Wortal.data.country,
            player: Wortal.data.playerId,
            isFirstPlay: Wortal.data.isFirstPlay,
        });
        setInterval(function () {
            if (document.visibilityState !== "hidden") {
                Wortal.data.gameTimer += 1;
            }
        }, 1000);
    }

    logGameEnd(): void {
        this.logEvent("GameEnd", {
            game: Wortal.data.gameName,
            timePlayed: Wortal.data.gameTimer,
        });
    }

    logLevelStart(level: string): void {
        if (Wortal.data.levelTimerHandle !== null) {
            clearInterval(Wortal.data.levelTimerHandle);
            Wortal.data.levelTimerHandle = null;
        }
        Wortal.data.levelName = level;
        Wortal.data.levelTimer = 0;
        Wortal.data.levelTimerHandle = setInterval(() => Wortal.data.levelTimer += 1, 1000);
        this.logEvent("LevelStart", {
            game: Wortal.data.gameId,
            level: level,
        });
    }

    logLevelEnd(level: string, score: string, wasCompleted: boolean): void {
        if (Wortal.data.levelTimerHandle !== null) {
            clearInterval(Wortal.data.levelTimerHandle);
            Wortal.data.levelTimerHandle = null;
        }
        if (Wortal.data.levelName !== level) {
            Wortal.data.levelTimer = 0;
        }
        this.logEvent("LevelEnd", {
            game: Wortal.data.gameId,
            level: level,
            score: score,
            wasCompleted: wasCompleted,
            time: Wortal.data.levelTimer,
        });
        Wortal.data.levelTimer = 0;
    }

    logTutorialStart(tutorial: string): void {
        if (Wortal.data.levelTimerHandle !== null) {
            clearInterval(Wortal.data.levelTimerHandle);
            Wortal.data.levelTimerHandle = null;
        }
        Wortal.data.levelName = tutorial;
        Wortal.data.levelTimer = 0;
        Wortal.data.levelTimerHandle = setInterval(() => Wortal.data.levelTimer += 1, 1000);
        this.logEvent("TutorialStart", {
            game: Wortal.data.gameId,
            tutorial: tutorial,
        });
    }

    logTutorialEnd(tutorial: string): void {
        if (Wortal.data.levelTimerHandle !== null) {
            clearInterval(Wortal.data.levelTimerHandle);
            Wortal.data.levelTimerHandle = null;
        }
        if (Wortal.data.levelName !== tutorial) {
            Wortal.data.levelTimer = 0;
        }
        this.logEvent("TutorialEnd", {
            game: Wortal.data.gameId,
            tutorial: tutorial,
            time: Wortal.data.levelTimer,
        });
        Wortal.data.levelTimer = 0;
    }

    logLevelUp(level: string): void {
        this.logEvent("LevelUp", {
            game: Wortal.data.gameId,
            level: level,
        });
        Wortal.debug("Logged Level Up: " + level);
    }

    logScore(score: string): void {
        this.logEvent("PostScore", {
            game: Wortal.data.gameId,
            score: score,
        });
        Wortal.debug("Logged Score: " + score);
    }

    logGameChoice(decision: string, choice: string): void {
        this.logEvent("GameChoice", {
            game: Wortal.data.gameId,
            decision: decision,
            choice: choice,
        });
        Wortal.debug("Logged Game Choice: " + decision + " / " + choice);
    }

    private logEvent(name: string, features: object): void {
        let request = new XMLHttpRequest();
        request.open("POST", "https://wombat.digitalwill.co.jp/wortal/events");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ name, features }));
    }
}
