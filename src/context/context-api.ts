import { ConnectedPlayer } from "../player/classes/connected-player";
import { ContextBase } from "./context-base";
import { ChoosePayload } from "./interfaces/choose-payload";
import { ContextSizeResponse } from "./interfaces/context-size-response";
import { InvitePayload } from "./interfaces/invite-payload";
import { LinkSharePayload } from "./interfaces/link-share-payload";
import { SharePayload } from "./interfaces/share-payload";
import { SwitchPayload } from "./interfaces/switch-payload";
import { UpdatePayload } from "./interfaces/update-payload";
import { ContextType } from "./types/context-payload-property-types";

/**
 * Context API is used to interact with the current context. This can be a messenger thread, group chat, etc.
 * This enables social features such as sharing game progress, challenging other players to beat a high score, etc.
 * @module Context
 */
export class ContextAPI {
    private _context: ContextBase;

    constructor(impl: ContextBase) {
        this._context = impl;
    }

    /**
     * Opens a context selection dialog for the player. If the player selects an available context, the client will attempt
     * to switch into that context, and resolve if successful. Otherwise, if the player exits the menu or the client fails
     * to switch into the new context, this function will reject.
     * @example
     * Wortal.context.chooseAsync()
     *  .then(console.log(Wortal.context.getId()));
     * @param {ChoosePayload} payload Object defining the options for the context choice.
     * @returns {Promise<void>} Promise that resolves when the context is switched.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>SAME_CONTEXT</li>
     * <li>NETWORK_FAILURE</li>
     * <li>USER_INPUT</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public chooseAsync(payload?: ChoosePayload): Promise<void> {
        return this._context.chooseAsync(payload);
    }

    /**
     * <p>Attempts to create a context between the current player and a specified player or a list of players. This API
     * supports 3 use cases:
     *
     * 1. When the input is a single playerID, it attempts to create or switch into a context between a specified player
     * and the current player
     * 2. When the input is a list of connected playerIDs, it attempts to create a context containing all the players
     * 3. When there's no input, a friend picker will be loaded to ask the player to create a context with friends to
     * play with.</p>
     * <p>For each of these cases, the returned promise will reject if any of the players listed are not Connected Players
     * of the current player, or if the player denies the request to enter the new context. Otherwise, the promise will
     * resolve when the game has switched into the new context.</p>
     *
     * PLATFORM NOTE: Viber and Link only support context creation with a single player. If an array of player IDs is passed
     * on these platforms, the call will be made with the first ID in the array.
     * @example
     * Wortal.context.createAsync('player123');
     * @param playerID ID of player to create a context with, or a list of player IDs to create a context with. If not
     * specified, a friend picker will be loaded to ask the player to create a context with friends to play with. Link
     * and Viber will only accept a single, required player ID. If no ID is passed on these platforms the call will fail.
     * If an array of IDs is passed on these platforms, the call will be made with the first ID in the array.
     * @returns {Promise<void>} Promise that resolves when the game has switched into the new context, or rejects otherwise.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>SAME_CONTEXT</li>
     * <li>NETWORK_FAILURE</li>
     * <li>USER_INPUT</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public createAsync(playerID?: string | string[]): Promise<void> {
        return this._context.createAsync(playerID);
    }

    /**
     * Gets the ID of the current context.
     * @example
     * const id = Wortal.context.getId();
     * console.log(id);
     * @returns {string | null} String ID of the current context if one exists. Null if the player is playing solo or
     * if the game is being played on a platform that does not currently support context.
     */
    public getId(): string | null {
        return this._context.getId();
    }

    /**
     * Gets an array of ConnectedPlayer objects containing information about active players in the current context
     * (people who played the game in the current context in the last 90 days).
     * @example
     * Wortal.context.getPlayersAsync()
     *  .then(players => {
     *    console.log(players.length);
     *    console.log(players[0].id);
     *    console.log(players[0].name);
     *    });
     * @returns {Promise<ConnectedPlayer[]>} Promise that contains an array of players in the current context.
     * This may include the current player.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>NETWORK_FAILURE</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>INVALID_OPERATION</li>
     * </ul>
     */
    public getPlayersAsync(): Promise<ConnectedPlayer[]> {
        return this._context.getPlayersAsync();
    }

    /**
     * Gets the type of the current context.
     * @example
     * const type = Wortal.context.getType();
     * console.log(type);
     * @returns {ContextType} The type of the current context.
     */
    public getType(): ContextType {
        return this._context.getType();
    }

    /**
     * This invokes a dialog to let the user invite one or more people to the game. A blob of data can be attached to the
     * invite which every game session launched from the invite will be able to access from `Wortal.session.getEntryPointData()`.
     * This data must be less than or equal to 1000 characters when stringified. The user may choose to cancel the action
     * and close the dialog, and the returned promise will resolve when the dialog is closed regardless of whether the user
     * actually invited people or not.
     *
     * The sections included in the dialog can be customized by using the `sections` parameter.
     * This can specify which sections to include, how many results to include in each section, and what order the sections
     * should appear in. The last section will include as many results as possible. If no sections are specified, the
     * default section settings will be applied. The filters parameter allows for filtering the results. If no results are
     * returned when the filters are applied, the results will be generated without the filters.
     * @example
     * Wortal.context.inviteAsync({
     *    image: 'data:base64Image',
     *    text: 'Invite text',
     *    cta: 'Play',
     *    data: { exampleData: 'yourData' },
     * })
     * .then(() => console.log("Invite sent!"))
     * @param {InvitePayload} payload Specify what to share in the invite. See example for details.
     * @returns {Promise<number>} Promise that resolves when the platform's friend picker has closed.
     * Includes number of friends the invite was shared with.
     *
     * PLATFORM NOTE: Facebook will always return 0.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>INVALID_OPERATION</li>
     * </ul>
     */
    public inviteAsync(payload: InvitePayload): Promise<number> {
        return this._context.inviteAsync(payload);
    }

    /**
     * This function determines whether the number of participants in the current game context is between a given minimum
     * and maximum, inclusive. If one of the bounds is null only the other bound will be checked against. It will always
     * return the original result for the first call made in a context in a given game play session. Subsequent calls,
     * regardless of arguments, will return the answer to the original query until a context change occurs and the query
     * result is reset.
     * @example
     * const result = Wortal.context.isSizeBetween(2, 4);
     * console.log(result.answer);
     * @param min Minimum number of players in context.
     * @param max Maximum number of players in context.
     * @returns {ContextSizeResponse} Object with the result of the check. Null if not supported.
     */
    public isSizeBetween(min?: number, max?: number): ContextSizeResponse | null {
        return this._context.isSizeBetween(min, max);
    }

    /**
     * This invokes a dialog to let the user share specified content, as a post on the user's timeline, for example.
     * A blob of data can be attached to the share which every game session launched from the share will be able to access
     * from `Wortal.session.getEntryPointData()`. This data must be less than or equal to 1000 characters when stringified.
     * The user may choose to cancel the share action and close the dialog, and the returned promise will resolve when the
     * dialog is closed regardless if the user actually shared the content or not.
     * @example
     * Wortal.context.shareAsync({
     *     image: 'data:base64Image',
     *     text: 'Share text',
     *     cta: 'Play',
     *     data: { exampleData: 'yourData' },
     * }).then(result => console.log(result)); // Contains shareCount with number of friends the share was sent to.
     * @param {SharePayload} payload Object defining the share message.
     * @returns {Promise<number>} Promise that resolves when the platform's friend picker has closed.
     * Includes number of friends the message was shared with.
     *
     * PLATFORM NOTE: Facebook will always return 0.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>INVALID_OPERATION</li>
     * </ul>
     */
    public shareAsync(payload: SharePayload): Promise<number> {
        return this._context.shareAsync(payload);
    }

    /**
     * This invokes a dialog that contains a custom game link that users can copy to their clipboard, or share.
     * A blob of data can be attached to the custom link - game sessions initiated from the link will be able to access the
     * data through `Wortal.session.getEntryPointData()`. This data should be less than or equal to 1000 characters when
     * stringified. The provided text and image will be used to generate the link preview, with the game name as the title
     * of the preview. The text is recommended to be less than 44 characters. The image is recommended to either be a square
     * or of the aspect ratio 1.91:1. The returned promise will resolve when the dialog is closed regardless if the user
     * actually shared the link or not.
     * @example
     * Wortal.context.shareLinkAsync({
     *    image: 'data:base64Image',
     *    text: 'Share text',
     *    data: { exampleData: 'yourData' },
     * })
     * .then(() => resumeGame);
     * @param payload Object defining the payload for the custom link.
     * @returns {Promise<string | void>} Promise that resolves when the dialog is closed. May include a string with the link.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>PENDING_REQUEST</li>
     * <li>INVALID_OPERATION</li>
     * </ul>
     */
    public shareLinkAsync(payload: LinkSharePayload): Promise<string | void> {
        return this._context.shareLinkAsync(payload);
    }

    /**
     * Request a switch into a specific context. If the player does not have permission to enter that context, or if the
     * player does not provide permission for the game to enter that context, this will reject. Otherwise, the promise will
     * resolve when the game has switched into the specified context.
     * @example
     * Wortal.context.switchAsync('abc123');
     * @param contextID ID of the desired context or the string SOLO to switch into a solo context.
     * @param payload Optional object defining the options for the context switch.
     * @returns {Promise<void>} Promise that resolves when the game has switched into the specified context, or rejects otherwise.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>SAME_CONTEXT</li>
     * <li>NETWORK_FAILURE</li>
     * <li>USER_INPUT</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public switchAsync(contextID: string, payload?: SwitchPayload): Promise<void> {
        return this._context.switchAsync(contextID, payload);
    }

    /**
     * Posts an update to the current context. Will send a message to the chat thread of the current context.
     * When players launch the game from this message, those game sessions will be able to access the specified blob
     * of data through Wortal.session.getEntryPointData().
     * @example
     * Wortal.context.updateAsync({
     *     image: 'data:base64Image',
     *     text: 'Update text',
     *     cta: 'Play',
     *     data: { exampleData: 'yourData' },
     * });
     * @param {UpdatePayload} payload Object defining the update message.
     * @returns {Promise<void>} Promise that resolves when the update is sent.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>PENDING_REQUEST</li>
     * <li>INVALID_OPERATION</li>
     * </ul>
     */
    public updateAsync(payload: UpdatePayload): Promise<void> {
        return this._context.updateAsync(payload);
    }
}
