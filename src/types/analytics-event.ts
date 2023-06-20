/** @hidden */
export type AnalyticsEventType = 'GameStart' | 'GameEnd' | 'LevelStart' | 'LevelEnd' | 'TutorialStart' | 'TutorialEnd'
    | 'LevelUp' | 'PostScore' | 'GameChoice' | 'TrafficSource' | 'Purchase' | 'PurchaseSubscription' | 'SocialInvite'
    | 'SocialShare' | 'CustomEvent';

/** @hidden */
export interface AnalyticsEventData {
    name: AnalyticsEventType;
    features: object;
}
