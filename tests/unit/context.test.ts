// @ts-nocheck

import { ContextBase } from "../../src/context/context-base";
import { ChoosePayload } from "../../src/context/interfaces/choose-payload";
import { InvitePayload } from "../../src/context/interfaces/invite-payload";
import { CoreAPI } from "../../src/core/core-api";
import { WORTAL_API } from "../../src/data/core-data";
import { ConnectedPlayer } from "../../src/player/classes/connected-player";
import { WortalLogger } from "../../src/utils/logger";

let Wortal: CoreAPI;
let context: ContextBase;

beforeEach(() => {
    jest.clearAllMocks();

    Wortal = new CoreAPI();
    context = new ContextBase();
});

describe('chooseAsync', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const payload: ChoosePayload = {
            text: "valid text",
            image: "data://image"
        };

        context.chooseAsync(payload);

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.CONTEXT_CHOOSE_ASYNC);
    });

    it('should return a Promise<void> when called with a valid payload', () => {
        const payload: ChoosePayload = {
            text: "valid text",
            image: "data://image"
        };

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeUndefined();
    });

    it('should return a Promise<void> when called with no payload', () => {
        const result = context.chooseAsync();

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeUndefined();
    });

    it('should reject with an error when called with an empty payload', () => {
        const payload: ChoosePayload = {};

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with a payload containing only valid text', () => {
        const payload: ChoosePayload = {
            text: "valid text"
        };

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with a payload containing only valid image', () => {
        const payload: ChoosePayload = {
            image: "data://image"
        };

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an invalid payload', () => {
        const payload: ChoosePayload = {
            text: 123,
            image: 123,
        };

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an invalid text in the payload', () => {
        const payload: ChoosePayload = {
            text: 123,
            image: "valid image"
        };

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an invalid image in the payload', () => {
        const payload: ChoosePayload = {
            text: "valid text",
            image: 123
        };

        const result = context.chooseAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

});

describe('createAsync', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        context.createAsync();

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.CONTEXT_CREATE_ASYNC);
    });

    it('should return a Promise<void> when called with a valid playerID', () => {
        const playerID = 'validPlayerID';

        const result = context.createAsync(playerID);

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeUndefined();
    });

    it('should return a Promise<void> when called without a playerID', () => {
        const result = context.createAsync();

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeUndefined();
    });

    it('should return a Promise<void> when called with an empty string as playerID', () => {
        const playerID = '';

        const result = context.createAsync(playerID);

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeUndefined();
    });

    it('should return a Promise<void> when called with an array of valid playerIDs', () => {
        const playerIDs = ['validPlayerID1', 'validPlayerID2'];

        const result = context.createAsync(playerIDs);

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeUndefined();
    });

    it('should reject with an error when called with an invalid playerID', () => {
        const playerID = 123;

        const result = context.createAsync(playerID);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an array of invalid playerIDs', () => {
        const playerIDs = [123, 'validPlayerID'];

        const result = context.createAsync(playerIDs);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an array of valid and invalid playerIDs', () => {
        const playerIDs = ['validPlayerID', 123];

        const result = context.createAsync(playerIDs);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

});

describe('getPlayersAsync', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        context.getPlayersAsync();

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC);
    });

    it('should return a Promise that resolves to an array of ConnectedPlayer objects', () => {
        const connectedPlayer: ConnectedPlayer = {
            id: "player1",
            name: "Player 1",
            score: 100
        };
        const connectedPlayers: ConnectedPlayer[] = [connectedPlayer];
        jest.spyOn(context, 'getPlayersAsyncImpl').mockResolvedValue(connectedPlayers);

        const result = context.getPlayersAsync();

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toEqual(connectedPlayers);
    });

    it('should return an empty array if there are no connected players', () => {
        jest.spyOn(context, 'getPlayersAsyncImpl').mockResolvedValue([]);

        const result = context.getPlayersAsync();

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toEqual([]);
    });

    it('should return an array of ConnectedPlayer objects with the correct properties', () => {
        const connectedPlayer: ConnectedPlayer = {
            id: "player1",
            name: "Player 1",
            score: 100
        };
        const connectedPlayers: ConnectedPlayer[] = [connectedPlayer];
        jest.spyOn(context, 'getPlayersAsyncImpl').mockResolvedValue(connectedPlayers);

        const result = context.getPlayersAsync();

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toEqual(connectedPlayers);
        expect(result).resolves.toHaveProperty('length', 1);
        expect(result).resolves.toHaveProperty('0.id', "player1");
        expect(result).resolves.toHaveProperty('0.name', "Player 1");
        expect(result).resolves.toHaveProperty('0.score', 100);
    });

    it('should return a rejected Promise if the validation of the method fails', () => {
        const error = new Error("Validation error");
        jest.spyOn(context, 'validateGetPlayersAsync').mockReturnValue({ valid: false, error });

        const result = context.getPlayersAsync();

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError(error);
    });

});

describe('inviteAsync', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const payload: InvitePayload = {
            text: "valid text",
            image: "data://image"
        };

        context.inviteAsync(payload);

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.CONTEXT_INVITE_ASYNC);
    });

    it('should return a Promise<number> when called with a valid payload', () => {
        const payload: InvitePayload = {
            text: "valid text",
            image: "data://image"
        };

        const result = context.inviteAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).resolves.toBeGreaterThanOrEqual(0);
    });

    it('should call inviteAsyncImpl when called with valid text and image payload', () => {
        const inviteAsyncImplMock = jest.spyOn(context, 'inviteAsyncImpl');
        const payload: InvitePayload = {
            text: "valid text",
            image: "data://image"
        };

        context.inviteAsync(payload);

        expect(inviteAsyncImplMock).toHaveBeenCalledWith(payload);
    });

    it('should reject with an error when called with an invalid payload text', () => {
        const payload: InvitePayload = {
            text: 123,
            image: "data://image"
        };

        const result = context.inviteAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an invalid payload image', () => {
        const payload: InvitePayload = {
            text: "valid text",
            image: 123
        };

        const result = context.inviteAsync(payload);

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

    it('should reject with an error when called with an invalid payload', () => {
        const result = context.inviteAsync({});

        expect(result).toBeInstanceOf(Promise);
        expect(result).rejects.toThrowError();
    });

});
