import { PlacementType } from "../../ads/types/ad-sense-types";
import { AdType } from "../../ads/types/ad-type";
import { AnalyticsBase } from "../analytics-base";

/**
 * Empty implementation of the Analytics API. This is used when the Analytics API is disabled due to platform
 * restrictions.
 * @hidden
 */
export class AnalyticsDisabled extends AnalyticsBase {

    protected logGameChoiceImpl(decision: string, choice: string): void {
    }

    protected logLevelEndImpl(level: string | number, score: string | number, wasCompleted: boolean): void {
    }

    protected logLevelStartImpl(level: string | number): void {
    }

    protected logLevelUpImpl(level: string | number): void {
    }

    protected logPurchaseImpl(productID: string, details?: string): void {
    }

    protected logPurchaseSubscriptionImpl(productID: string, details?: string): void {
    }

    protected logScoreImpl(score: string | number): void {
    }

    protected logSocialInviteImpl(placement: string): void {
    }

    protected logSocialShareImpl(placement: string): void {
    }

    protected logTutorialEndImpl(tutorial: string, wasCompleted: boolean): void {
    }

    protected logTutorialStartImpl(tutorial: string): void {
    }

    protected _logGameEndImpl(): void {
    }

    protected _logGameStartImpl(): void {
    }

    protected _logTrafficSourceImpl(): void {
    }

    protected _logAdCallImpl(format: AdType, placement: PlacementType, success: boolean, viewedReward?: boolean) {
    }

}
