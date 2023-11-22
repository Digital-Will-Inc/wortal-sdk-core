import { PlacementType } from "../../ads/types/ad-sense-types";
import { AdType } from "../../ads/types/ad-type";
import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import Wortal from "../../index";
import { AnalyticsBase } from "../analytics-base";
import { WombatEvent } from "../classes/WombatEvent";
import { AnalyticsEventData, EventData_AdCall } from "../interfaces/analytics-event-data";

/**
 * Wombat Analytics implementation. This sends events to the Wortal backend for processing.
 * @hidden
 */
export class AnalyticsWombat extends AnalyticsBase {
//#region Public API

    protected logGameChoiceImpl(decision: string, choice: string): void {
        const data: AnalyticsEventData = {
            name: "GameChoice",
            features: {
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
                level: level,
                score: score,
                wasCompleted: wasCompleted,
                time: Wortal.session._internalGameState.levelTimer,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logLevelStartImpl(level: string | number): void {
        const data: AnalyticsEventData = {
            name: "LevelStart",
            features: {
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
                tutorial: tutorial,
                wasCompleted: wasCompleted,
                time: Wortal.session._internalGameState.levelTimer,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected logTutorialStartImpl(tutorial: string): void {
        const data: AnalyticsEventData = {
            name: "TutorialStart",
            features: {
                game: Wortal.session._internalSession.gameID,
                player: Wortal.player._internalPlayer.id,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
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
                game: Wortal.session._internalSession.gameID,
                timePlayed: Wortal.session._internalGameState.gameTimer,
                platform: Wortal._internalPlatform,
                player: Wortal.player._internalPlayer.id,
                adsCalled: Wortal.ads._internalAdConfig.adsCalled,
                adsShown: Wortal.ads._internalAdConfig.adsShown,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected _logGameStartImpl() {
        const data: AnalyticsEventData = {
            name: "GameStart",
            features: {
                game: Wortal.session._internalSession.gameID,
                browser: Wortal.session._internalSession.browser,
                platform: Wortal._internalPlatform,
                country: Wortal.session._internalSession.country,
                player: Wortal.player._internalPlayer.id,
                isFirstPlay: Wortal.player._internalPlayer.isFirstPlay,
                daysSinceFirstPlay: Wortal.player._internalPlayer.daysSinceFirstPlay,
                isAdBlocked: Wortal.ads._internalAdConfig.isAdBlocked,
                loadTime: Wortal.session._internalGameState.gameLoadTimer,
            }
        };

        const event = new WombatEvent(data);
        event.send();
    }

    protected _logTrafficSourceImpl() {
        if (Wortal._internalPlatform !== "viber" && Wortal._internalPlatform !== "link") {
            return;
        }

        Wortal.session.getEntryPointAsync()
            .then((entryPoint: string) => {
                const data: AnalyticsEventData = {
                    name: "TrafficSource",
                    features: {
                        game: Wortal.session._internalSession.gameID,
                        platform: Wortal._internalPlatform,
                        country: Wortal.session._internalSession.country,
                        player: Wortal.player._internalPlayer.id,
                        entryPoint: entryPoint,
                        data: JSON.stringify(Wortal.session.getTrafficSource()),
                    }
                };

                const event = new WombatEvent(data);
                event.send();
            })
            .catch((error: ErrorMessage_Viber) => {
                // Even if we get an error we should still try and send the traffic source.
                Wortal._log.exception(error.code);
                const data: AnalyticsEventData = {
                    name: "TrafficSource",
                    features: {
                        game: Wortal.session._internalSession.gameID,
                        platform: Wortal._internalPlatform,
                        country: Wortal.session._internalSession.country,
                        player: Wortal.player._internalPlayer.id,
                        entryPoint: "unknown/error",
                        data: JSON.stringify(Wortal.session.getTrafficSource()),
                    }
                };

                const event = new WombatEvent(data);
                event.send();
            });
    }

    protected _logAdCallImpl(format: AdType, placement: PlacementType, success: boolean, viewedReward?: boolean) {
        const data: EventData_AdCall = {
            format: format,
            placement: placement,
            platform: Wortal._internalPlatform,
            success: success,
            viewedRewarded: viewedReward,
            playerID: Wortal.player._internalPlayer.id,
            gameID: Wortal.session._internalSession.gameID,
            playTimeAtCall: Wortal.session._internalGameState.gameTimer,
        };

        const eventData: AnalyticsEventData = {
            name: "AdCall",
            features: data,
        };

        const event = new WombatEvent(eventData);
        event.send();
    }

//#endregion
}
