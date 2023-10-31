import { API_URL, WORTAL_API } from "../data/core-data";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { ConnectedPlayer } from "../player/classes/connected-player";
import { invalidParams } from "../errors/error-handler";
import { apiCall } from "../utils/logger";
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
export abstract class ContextBase {
    constructor() {
    }

//#region Public API

    public chooseAsync(payload?: ChoosePayload): Promise<void> {
        apiCall(WORTAL_API.CONTEXT_CHOOSE_ASYNC);

        return this.chooseAsyncImpl(payload);
    }

    public createAsync(playerID?: string | string[]): Promise<void> {
        apiCall(WORTAL_API.CONTEXT_CREATE_ASYNC);

        const validationResult = this.validateCreateAsync(playerID);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.createAsyncImpl(playerID);
    }

    public getId(): string {
        apiCall(WORTAL_API.CONTEXT_GET_ID);

        return this.getIdImpl();
    }

    public getPlayersAsync(): Promise<ConnectedPlayer[]> {
        apiCall(WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC);

        return this.getPlayersAsyncImpl();
    }

    public getType(): ContextType {
        apiCall(WORTAL_API.CONTEXT_GET_TYPE);

        return this.getTypeImpl();
    }

    public inviteAsync(payload: InvitePayload): Promise<number> {
        apiCall(WORTAL_API.CONTEXT_INVITE_ASYNC);

        const validationResult = this.validateInviteAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.inviteAsyncImpl(payload);
    }

    public isSizeBetween(min?: number, max?: number): ContextSizeResponse | null {
        apiCall(WORTAL_API.CONTEXT_IS_SIZE_BETWEEN);

        return this.isSizeBetweenImpl(min, max);
    }

    public shareAsync(payload: SharePayload): Promise<number> {
        apiCall(WORTAL_API.CONTEXT_SHARE_ASYNC);

        const validationResult = this.validateShareAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.shareAsyncImpl(payload);
    }

    public shareLinkAsync(payload: LinkSharePayload): Promise<string | void> {
        apiCall(WORTAL_API.CONTEXT_SHARE_LINK_ASYNC);

        const validationResult = this.validateShareLinkAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.shareLinkAsyncImpl(payload);
    }

    public switchAsync(contextID: string, payload?: SwitchPayload): Promise<void> {
        apiCall(WORTAL_API.CONTEXT_SWITCH_ASYNC);

        const validationResult = this.validateSwitchAsync(contextID, payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.switchAsyncImpl(contextID, payload);
    }

    public updateAsync(payload: UpdatePayload): Promise<void> {
        apiCall(WORTAL_API.CONTEXT_UPDATE_ASYNC);

        const validationResult = this.validateUpdateAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.updateAsyncImpl(payload);
    }

//#endregion
//#region Implementation interface

    protected abstract chooseAsyncImpl(payload?: ChoosePayload): Promise<void>;
    protected abstract createAsyncImpl(playerID?: string | string[]): Promise<void>;
    protected abstract getIdImpl(): string;
    protected abstract getPlayersAsyncImpl(): Promise<ConnectedPlayer[]>;
    protected abstract getTypeImpl(): ContextType;
    protected abstract inviteAsyncImpl(payload: InvitePayload): Promise<number>;
    protected abstract isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null;
    protected abstract shareAsyncImpl(payload: SharePayload): Promise<number>;
    protected abstract shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void>;
    protected abstract switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void>;
    protected abstract updateAsyncImpl(payload: UpdatePayload): Promise<void>;

//#endregion
//#region Validation

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
                error: invalidParams(undefined, WORTAL_API.CONTEXT_CREATE_ASYNC, API_URL.CONTEXT_CREATE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateInviteAsync(payload: InvitePayload): ValidationResult {
        if (!isValidPayloadText(payload.text)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_INVITE_ASYNC, API_URL.CONTEXT_INVITE_ASYNC)
            };
        }

        if (!isValidPayloadImage(payload.image)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_INVITE_ASYNC, API_URL.CONTEXT_INVITE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateShareAsync(payload: SharePayload): ValidationResult {
        if (!isValidPayloadText(payload.text)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_SHARE_ASYNC, API_URL.CONTEXT_SHARE_ASYNC)
            };
        }

        if (!isValidPayloadImage(payload.image)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_SHARE_ASYNC, API_URL.CONTEXT_SHARE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateShareLinkAsync(payload: LinkSharePayload): ValidationResult {
        if (typeof payload.data === "undefined") {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_SHARE_LINK_ASYNC, API_URL.CONTEXT_SHARE_LINK_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateSwitchAsync(contextID: string, payload?: SwitchPayload): ValidationResult {
        if (!isValidString(contextID)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_SWITCH_ASYNC, API_URL.CONTEXT_SWITCH_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateUpdateAsync(payload: UpdatePayload): ValidationResult {
        if (!isValidPayloadText(payload.text)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_UPDATE_ASYNC, API_URL.CONTEXT_UPDATE_ASYNC)
            };
        }

        if (!isValidPayloadImage(payload.image)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.CONTEXT_UPDATE_ASYNC, API_URL.CONTEXT_UPDATE_ASYNC)
            };
        }

        return { valid: true };
    }

//#endregion
}
