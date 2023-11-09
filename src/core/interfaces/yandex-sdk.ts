/**
 * Yandex SDK interface
 * @hidden
 */
export interface YandexSDK {
    init(): Promise<YandexSDK>;
    features: {
        LoadingAPI?: {
            ready(): void;
        }
    }
}
