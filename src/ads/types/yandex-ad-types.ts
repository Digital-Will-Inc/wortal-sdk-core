/**
 * Reasons for a Yandex banner to ad to fail to show.
 * - `ADV_IS_NOT_CONNECTED` - Banners aren't connected.
 * - `UNKNOWN` - Error displaying ads on the Yandex side.
 *
 * https://yandex.com/dev/games/doc/en/sdk/sdk-adv#sticky-banner
 * @hidden
 */
export type YandexAdFailReason = "ADV_IS_NOT_CONNECTED" | "UNKNOWN";
