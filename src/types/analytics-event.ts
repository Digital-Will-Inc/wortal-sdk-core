/**
 * Types of analytics events.
 */
export enum AnalyticsEventType {
    GAME_START = "GameStart",
    GAME_END = "GameEnd",
    LEVEL_START = "LevelStart",
    LEVEL_END = "LevelEnd",
    TUTORIAL_START = "TutorialStart",
    TUTORIAL_END = "TutorialEnd",
    LEVEL_UP = "LevelUp",
    POST_SCORE = "PostScore",
    GAME_CHOICE = "GameChoice",
}

/** @hidden */
export interface AnalyticsEventData {
    name: AnalyticsEventType;
    features: object;
}
