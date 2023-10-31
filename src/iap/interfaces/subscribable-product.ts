import { SubscriptionTerm } from "../types/subscription-types";

/**
 * Represents a game's subscribable product information.
 */
export interface SubscribableProduct {
    /**
     * The billing cycle of a subscription.
     */
    subscriptionTerm: SubscriptionTerm,
}
