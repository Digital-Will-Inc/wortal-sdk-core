/**
 * Purchase Platforms that may be returned by subscriptions API, representing the platform by which the user made the purchase.
 *
 * - `FB`: The user made the purchase on web.
 * - `GOOGLE`: The user made the purchase in the Android apps.
 * - `APPLE`: Not eligible
 * - `OC`: Not eligible
 * - `UNKNOWN`: Unknown
 */
export type PurchasePlatform = "FB" | "GOOGLE" | "APPLE" | "OC" | "UNKNOWN"

/**
 * Subscription Terms that may be returned by subscriptions API, representing the billing cycle of the subscription.
 *
 * - `WEEKLY` The user will be charged every week.
 * - `BIWEEKLY` The user will be charged every two weeks.
 * - `MONTHLY` The user will be charged every month.
 * - `QUARTERLY` The user will be charged every three months.
 * - `SEMIANNUAL` The user will be charged every six months.
 * - `ANNUAL` The user will be charged every year.
 */
export type SubscriptionTerm = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "SEMIANNUAL" | "ANNUAL"
