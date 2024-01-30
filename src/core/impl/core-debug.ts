import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { SDK_SRC } from "../../data/core-data";
import Wortal from "../../index";
import { onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";

/**
 * Debug implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreDebug extends CoreBase {
    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        // Xsolla login for Waves integration.
        return this.defaultAuthenticateAsyncImpl(payload)
            .then((response) => {
                Wortal._log.debug("Player authenticated successfully. Payload:", payload);
                return Promise.resolve(response);
            });

    }

    protected initializeAsyncImpl(): Promise<void> {
        return this.defaultInitializeAsyncImpl();
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        Wortal._log.debug("Player account linked successfully.");
        return Promise.resolve(true);
    }

    protected onPauseImpl(callback: () => void): void {
        onPauseFunctions.push(callback);
    }

    protected performHapticFeedbackAsyncImpl(): Promise<void> {
        Wortal._log.debug("Haptic feedback requested successfully.");
        return Promise.resolve();
    }

    protected setLoadingProgressImpl(progress: number): void {
        return;
    }

    protected startGameAsyncImpl(): Promise<void> {
        return this.defaultStartGameAsyncImpl();
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return new Promise((resolve) => {
            const metaElement = document.createElement("meta");
            const googleAdsSDK = document.createElement("script");

            Wortal.ads._internalAdConfig.setClientID("ca-pub-123456789");
            Wortal.ads._internalAdConfig.setHostID("");
            Wortal.ads._internalAdConfig.setChannelID("");

            googleAdsSDK.setAttribute("data-ad-client", Wortal.ads._internalAdConfig.clientID);
            googleAdsSDK.setAttribute("data-adbreak-test", "on");

            googleAdsSDK.setAttribute("src", SDK_SRC.GOOGLE);
            googleAdsSDK.setAttribute("type", "text/javascript");

            metaElement.setAttribute("name", "google-adsense-platform-account");
            metaElement.setAttribute("content", Wortal.ads._internalAdConfig.hostID);

            googleAdsSDK.onload = () => {
                Wortal._log.debug("Debug platform SDK initialized with ads.");
                resolve();
            }

            googleAdsSDK.onerror = () => {
                Wortal._log.debug("Ad blocker detected. Debug platform SDK initialized without ads.");
                Wortal.ads._internalAdConfig.setAdBlocked(true);
                resolve();
            };

            document.head.appendChild(metaElement);
            document.head.appendChild(googleAdsSDK);
        });
    }

    protected _initializeSDKAsyncImpl(): Promise<void> {
        return this.defaultInitializeSDKAsyncImpl();
    }
}
