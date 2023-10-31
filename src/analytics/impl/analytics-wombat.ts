import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import { exception } from "../../utils/logger";
import { AnalyticsBase } from "../analytics-base";
import { WombatEvent } from "../classes/WombatEvent";
import { AnalyticsEventData } from "../interfaces/analytics-event-data";

/**
 * Wombat Analytics implementation. This sends events to the Wortal backend for processing.
 * @hidden
 */
export class AnalyticsWombat extends AnalyticsBase {
    constructor() {
        super();
    }

//#region Public API

    protected logGameChoiceImpl(decision: string, choice: string): void {
        const data: AnalyticsEventData = {
            name: "GameChoice",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                decision: decision,
                choice: choice,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logLevelEndImpl(level: string | number, score: string | number, wasCompleted: boolean): void {
        const data: AnalyticsEventData = {
            name: "LevelEnd",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                level: level,
                score: score,
                wasCompleted: wasCompleted,
                time: window.Wortal.session._internalGameState.levelTimer,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logLevelStartImpl(level: string | number): void {
        const data: AnalyticsEventData = {
            name: "LevelStart",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                level: level,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logLevelUpImpl(level: string | number): void {
        const data: AnalyticsEventData = {
            name: "LevelUp",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                level: level,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logPurchaseImpl(productID: string, details?: string): void {
        const data: AnalyticsEventData = {
            name: "Purchase",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                productID: productID,
                ...details && {details},
            }
        }

        const event = new WombatEvent(data);
        event.send();
    }

    protected logPurchaseSubscriptionImpl(productID: string, details?: string): void {
        const data: AnalyticsEventData = {
            name: "PurchaseSubscription",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                productID: productID,
                ...details && {details},
            }
        }

        const event = new WombatEvent(data);
        event.send();
    }

    protected logScoreImpl(score: string | number): void {
        const data: AnalyticsEventData = {
            name: "PostScore",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                score: score,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logSocialInviteImpl(placement: string): void {
        const data: AnalyticsEventData = {
            name: "SocialInvite",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                placement: placement,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logSocialShareImpl(placement: string): void {
        const data: AnalyticsEventData = {
            name: "SocialShare",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                placement: placement,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logTutorialEndImpl(tutorial: string, wasCompleted: boolean): void {
        const data: AnalyticsEventData = {
            name: "TutorialEnd",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                tutorial: tutorial,
                wasCompleted: wasCompleted,
                time: window.Wortal.session._internalGameState.levelTimer,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logTutorialStartImpl(tutorial: string): void {
        const data: AnalyticsEventData = {
            name: "TutorialStart",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                player: window.Wortal.player._internalPlayer.id,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                tutorial: tutorial,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

//#endregion
//#region Internal API

    protected _logGameEndImpl() {
        const data: AnalyticsEventData = {
            name: "GameEnd",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                timePlayed: window.Wortal.session._internalGameState.gameTimer,
                platform: window.Wortal._internalPlatform,
                player: window.Wortal.player._internalPlayer.id,
                adsCalled: window.Wortal.ads._internalAdConfig.adsCalled,
                adsShown: window.Wortal.ads._internalAdConfig.adsShown,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected _logGameStartImpl() {
        const data: AnalyticsEventData = {
            name: "GameStart",
            features: {
                game: window.Wortal.session._internalSession.gameId,
                browser: window.Wortal.session._internalSession.browser,
                platform: window.Wortal._internalPlatform,
                country: window.Wortal.session._internalSession.country,
                player: window.Wortal.player._internalPlayer.id,
                isFirstPlay: window.Wortal.player._internalPlayer.isFirstPlay,
                daysSinceFirstPlay: window.Wortal.player._internalPlayer.daysSinceFirstPlay,
                isAdBlocked: window.Wortal.ads._internalAdConfig.isAdBlocked,
                loadTime: window.Wortal.session._internalGameState.gameLoadTimer,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected _logTrafficSourceImpl() {
        if (window.Wortal._internalPlatform !== "viber" && window.Wortal._internalPlatform !== "link") {
            return;
        }

        window.Wortal.session.getEntryPointAsync()
            .then((entryPoint: string) => {
                const data: AnalyticsEventData = {
                    name: "TrafficSource",
                    features: {
                        game: window.Wortal.session._internalSession.gameId,
                        platform: window.Wortal._internalPlatform,
                        country: window.Wortal.session._internalSession.country,
                        player: window.Wortal.player._internalPlayer.id,
                        entryPoint: entryPoint,
                        data: JSON.stringify(window.Wortal.session.getTrafficSource()),
                    }
                };

                const event = new WombatEvent(data);
                event.send();
            })
            .catch((error: ErrorMessage_Viber) => {
                // Even if we get an error we should still try and send the traffic source.
                exception(error.code);
                const data: AnalyticsEventData = {
                    name: "TrafficSource",
                    features: {
                        game: window.Wortal.session._internalSession.gameId,
                        platform: window.Wortal._internalPlatform,
                        country: window.Wortal.session._internalSession.country,
                        player: window.Wortal.player._internalPlayer.id,
                        entryPoint: "unknown/error",
                        data: JSON.stringify(window.Wortal.session.getTrafficSource()),
                    }
                };

                const event = new WombatEvent(data);
                event.send();
            });
    }

//#endregion
}
