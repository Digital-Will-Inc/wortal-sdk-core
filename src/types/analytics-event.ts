/**
 * Types of analytics events.
 */
export type AnalyticsEventType = 'GameStart' | 'GameEnd' | 'LevelStart' | 'LevelEnd' | 'TutorialStart' | 'TutorialEnd'
    | 'LevelUp' | 'PostScore' | 'GameChoice'

/** @hidden */
export interface AnalyticsEventData {
    name: AnalyticsEventType;
    features: object;
}
