import { API_URL, WORTAL_API } from "../data/core-data";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { ConnectedPlayer } from "../player/classes/connected-player";
import { implementationError, invalidParams, notInitialized } from "../errors/error-handler";
import { isValidPayloadImage, isValidPayloadText, isValidString } from "../utils/validators";
import { ChoosePayload } from "./interfaces/choose-payload";
import { ContextSizeResponse } from "./interfaces/context-size-response";
import { InvitePayload } from "./interfaces/invite-payload";
import { LinkSharePayload } from "./interfaces/link-share-payload";
import { SharePayload } from "./interfaces/share-payload";
import { SwitchPayload } from "./interfaces/switch-payload";
import { UpdatePayload } from "./interfaces/update-payload";
import { ContextType } from "./types/context-payload-property-types";

/**
 * Base class for context implementations. Extend this class to implement context functionality for a specific platform.
 * @hidden
 */
export class ContextBase {
//#region Public API

    public chooseAsync(payload?: ChoosePayload): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_CHOOSE_ASYNC);

        const validationResult = this.validateChooseAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.chooseAsyncImpl(payload);
    }

    public createAsync(playerID?: string | string[]): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_CREATE_ASYNC);

        const validationResult = this.validateCreateAsync(playerID);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.createAsyncImpl(playerID);
    }

    public getId(): string {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_GET_ID);

        const validationResult = this.validateGetId();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.getIdImpl();
    }

    public getPlayersAsync(): Promise<ConnectedPlayer[]> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC);

        const validationResult = this.validateGetPlayersAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getPlayersAsyncImpl();
    }

    public getType(): ContextType {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_GET_TYPE);

        const validationResult = this.validateGetType();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.getTypeImpl();
    }

    public inviteAsync(payload: InvitePayload): Promise<number> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_INVITE_ASYNC);

        const validationResult = this.validateInviteAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.inviteAsyncImpl(payload);
    }

    public isSizeBetween(min?: number, max?: number): ContextSizeResponse | null {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_IS_SIZE_BETWEEN);

        const validationResult = this.validateIsSizeBetween(min, max);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.isSizeBetweenImpl(min, max);
    }

    public shareAsync(payload: SharePayload): Promise<number> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_SHARE_ASYNC);

        const validationResult = this.validateShareAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.shareAsyncImpl(payload);
    }

    public shareLinkAsync(payload: LinkSharePayload): Promise<string | void> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_SHARE_LINK_ASYNC);

        const validationResult = this.validateShareLinkAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.shareLinkAsyncImpl(payload);
    }

    public switchAsync(contextID: string, payload?: SwitchPayload): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_SWITCH_ASYNC);

        const validationResult = this.validateSwitchAsync(contextID, payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.switchAsyncImpl(contextID, payload);
    }

    public updateAsync(payload: UpdatePayload): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.CONTEXT_UPDATE_ASYNC);

        const validationResult = this.validateUpdateAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.updateAsyncImpl(payload);
    }

//#endregion
//#region Implementation interface

    protected chooseAsyncImpl(payload?: ChoosePayload): Promise<void> { throw implementationError(); }
    protected createAsyncImpl(playerID?: string | string[]): Promise<void> { throw implementationError(); }
    protected getIdImpl(): string { throw implementationError(); }
    protected getPlayersAsyncImpl(): Promise<ConnectedPlayer[]> { throw implementationError(); }
    protected getTypeImpl(): ContextType { throw implementationError(); }
    protected inviteAsyncImpl(payload: InvitePayload): Promise<number> { throw implementationError(); }
    protected isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null { throw implementationError(); }
    protected shareAsyncImpl(payload: SharePayload): Promise<number> { throw implementationError(); }
    protected shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void> { throw implementationError(); }
    protected switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void> { throw implementationError(); }
    protected updateAsyncImpl(payload: UpdatePayload): Promise<void> { throw implementationError(); }

//#endregion
//#region Validation

    protected validateChooseAsync(payload?: ChoosePayload): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_CHOOSE_ASYNC,
                    API_URL.CONTEXT_CHOOSE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateCreateAsync(playerID?: string | string[]): ValidationResult {
        // Facebook takes anything here... single ID, array of IDs or nothing.
        if (Wortal._internalPlatform === "facebook") {
            return { valid: true };
        }

        if (Array.isArray(playerID)) {
            playerID = playerID[0];
        }

        if (!isValidString(playerID)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_CREATE_ASYNC,
                    API_URL.CONTEXT_CREATE_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_CREATE_ASYNC,
                    API_URL.CONTEXT_CREATE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateGetId(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_GET_ID,
                    API_URL.CONTEXT_GET_ID)
            };
        }

        return { valid: true };
    }

    protected validateGetPlayersAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC,
                    API_URL.CONTEXT_GET_PLAYERS_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateGetType(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_GET_TYPE,
                    API_URL.CONTEXT_GET_TYPE)
            };
        }

        return { valid: true };
    }

    protected validateInviteAsync(payload: InvitePayload): ValidationResult {
        if (!isValidPayloadText(payload.text)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_INVITE_ASYNC,
                    API_URL.CONTEXT_INVITE_ASYNC)
            };
        }

        if (!isValidPayloadImage(payload.image)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_INVITE_ASYNC,
                    API_URL.CONTEXT_INVITE_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_INVITE_ASYNC,
                    API_URL.CONTEXT_INVITE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateIsSizeBetween(min?: number, max?: number): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_IS_SIZE_BETWEEN,
                    API_URL.CONTEXT_IS_SIZE_BETWEEN)
            };
        }

        return { valid: true };
    }

    protected validateShareAsync(payload: SharePayload): ValidationResult {
        if (!isValidPayloadText(payload.text)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_SHARE_ASYNC,
                    API_URL.CONTEXT_SHARE_ASYNC)
            };
        }

        if (!isValidPayloadImage(payload.image)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_SHARE_ASYNC,
                    API_URL.CONTEXT_SHARE_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_SHARE_ASYNC,
                    API_URL.CONTEXT_SHARE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateShareLinkAsync(payload: LinkSharePayload): ValidationResult {
        if (typeof payload.data === "undefined") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_SHARE_LINK_ASYNC,
                    API_URL.CONTEXT_SHARE_LINK_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_SHARE_LINK_ASYNC,
                    API_URL.CONTEXT_SHARE_LINK_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateSwitchAsync(contextID: string, payload?: SwitchPayload): ValidationResult {
        if (!isValidString(contextID)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_SWITCH_ASYNC,
                    API_URL.CONTEXT_SWITCH_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_SWITCH_ASYNC,
                    API_URL.CONTEXT_SWITCH_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateUpdateAsync(payload: UpdatePayload): ValidationResult {
        if (!isValidPayloadText(payload.text)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_UPDATE_ASYNC,
                    API_URL.CONTEXT_UPDATE_ASYNC)
            };
        }

        if (!isValidPayloadImage(payload.image)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.CONTEXT_UPDATE_ASYNC,
                    API_URL.CONTEXT_UPDATE_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.CONTEXT_UPDATE_ASYNC,
                    API_URL.CONTEXT_UPDATE_ASYNC)
            };
        }

        return { valid: true };
    }

//#endregion
}
