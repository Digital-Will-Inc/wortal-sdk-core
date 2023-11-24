// @ts-nocheck

import Wortal from "../../src";
import { AnalyticsBase } from "../../src/analytics/analytics-base";
import { WORTAL_API } from "../../src/data/core-data";
import { WortalLogger } from "../../src/utils/logger";

let analytics: AnalyticsBase;

beforeAll(() => {
    Object.defineProperty(Wortal, "isInitialized",
        {
            value: true,
            writable: true,
        });
});

beforeEach(() => {
    jest.clearAllMocks();

    analytics = new AnalyticsBase();

    Object.defineProperty(Wortal, "session",
        {
            value: {
                _internalGameState: {
                    clearLevelTimerHandle: jest.fn(),
                    resetLevelTimer: jest.fn(),
                    setLevelName: jest.fn(),
                    startLevelTimer: jest.fn(),
                }
            },
            writable: true,
        });
});

describe('logGameChoice', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logGameChoice("decision", "choice");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_GAME_CHOICE);
    });

    it('should log game choice when decision and choice parameters are both valid strings', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("decision", "choice");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision", "choice");
    });

    it('should log game choice when decision contains whitespace', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("decision ", "choice");
        analytics.logGameChoice(" decision", "choice");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision ", "choice");
        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith(" decision", "choice");
    });

    it('should log game choice when decision contains special characters', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("decision!@#$%^&*()", "choice");
        analytics.logGameChoice("!@#$%^&*()decision", "choice");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision!@#$%^&*()", "choice");
        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("!@#$%^&*()decision", "choice");
    });

    it('should log game choice when decision contains non-ASCII characters', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("日本語", "choice");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("日本語", "choice");
    });

    it('should log game choice when choice contains whitespace', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("decision", " choice");
        analytics.logGameChoice("decision", "choice ");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision", " choice");
        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision", "choice ");
    });

    it('should log game choice when choice contains special characters', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("decision", "choice!@#$%^&*()");
        analytics.logGameChoice("decision", "!@#$%^&*()choice");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision", "choice!@#$%^&*()");
        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision", "!@#$%^&*()choice");
    });

    it('should log game choice when choice contains non-ASCII characters', () => {
        analytics.logGameChoiceImpl = jest.fn();

        analytics.logGameChoice("decision", "日本語");

        expect(analytics.logGameChoiceImpl).toHaveBeenCalledWith("decision", "日本語");
    });

    it('should throw an error when decision parameter is not a string', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice(123, "choice");
        }).toThrow();
    });

    it('should throw an error when decision parameter is undefined', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice(undefined, "choice");
        }).toThrow();
    });

    it('should throw an error when decision parameter is an empty string', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice("", "choice");
        }).toThrow();
    });

    it('should throw an error when decision parameter is null', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice(null, "choice");
        }).toThrow();
    });

    it('should throw an error when choice parameter is not a string', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice("decision", 123);
        }).toThrow();
    });

    it('should throw an error when choice parameter is undefined', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice("decision", undefined);
        }).toThrow();
    });

    it('should throw an error when choice parameter is an empty string', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice("decision", "");
        }).toThrow();
    });

    it('should throw an error when choice parameter is null', () => {
        analytics.logGameChoiceImpl = jest.fn();

        expect(() => {
            analytics.logGameChoice("decision", null);
        }).toThrow();
    });

});

describe('logLevelEnd', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        const level = "1";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_LEVEL_END);
    });

    it('should log level end when level and score are both valid string parameters', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level = "1";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score, wasCompleted);
    });

    it('should log level end when level and score are both valid number parameters', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level = 1;
        const score = 100;
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level.toString(), score, wasCompleted);
    });

    it ('should log level end when level contains whitespace', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level_pre = "1 ";
        const level_post = " 1";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level_pre, score, wasCompleted);
        analytics.logLevelEnd(level_post, score, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level_pre, score, wasCompleted);
        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level_post, score, wasCompleted);
    });

    it('should log level end when level contains special characters', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level_pre = "1!@#$%^&*()";
        const level_post = "!@#$%^&*()1";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level_pre, score, wasCompleted);
        analytics.logLevelEnd(level_post, score, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level_pre, score, wasCompleted);
        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level_post, score, wasCompleted);
    });

    it('should log level end when level contains non-ASCII characters', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level = "日本語";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score, wasCompleted);
    });

    it('should log level end when score contains whitespace', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level = "1";
        const score_pre = "100 ";
        const score_post = " 100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score_pre, wasCompleted);
        analytics.logLevelEnd(level, score_post, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score_pre, wasCompleted);
        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score_post, wasCompleted);
    });

    it('should log level end when score contains special characters', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level = "1";
        const score_pre = "100!@#$%^&*()";
        const score_post = "!@#$%^&*()100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score_pre, wasCompleted);
        analytics.logLevelEnd(level, score_post, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score_pre, wasCompleted);
        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score_post, wasCompleted);
    });

    it('should log level end when score contains non-ASCII characters', () => {
        analytics.logLevelEndImpl = jest.fn();

        const level = "1";
        const score = "日本語";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(analytics.logLevelEndImpl).toHaveBeenCalledWith(level, score, wasCompleted);
    });

    it('should clear level timer handle', () => {
        const level = "1";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(Wortal.session._internalGameState.clearLevelTimerHandle).toHaveBeenCalled();
    });

    it('should reset level timer if level name does not match', () => {
        const level = "1";
        const score = "100";
        const wasCompleted = true;

        analytics.logLevelEnd(level, score, wasCompleted);

        expect(Wortal.session._internalGameState.resetLevelTimer).toHaveBeenCalled();
    });

    it('should throw error if wasCompleted parameter is not valid boolean', () => {
        const level = "1";
        const score = "100";
        const wasCompleted = null;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if level parameter is not valid string or number', () => {
        const level = true;
        const score = "100";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if level parameter is undefined', () => {
        const level = undefined;
        const score = "100";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if level parameter is null', () => {
        const level = null;
        const score = "100";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if level parameter is empty string', () => {
        const level = "";
        const score = "100";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if level parameter is NaN', () => {
        const level = NaN;
        const score = "100";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if level parameter is Infinity', () => {
        const level = Infinity;
        const score = "100";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if score parameter is not valid string or number', () => {
        const level = "1";
        const score = null;
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if score parameter is undefined', () => {
        const level = "1";
        const score = undefined;
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if score parameter is empty string', () => {
        const level = "1";
        const score = "";
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if score parameter is null', () => {
        const level = "1";
        const score = null;
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if score parameter is NaN', () => {
        const level = "1";
        const score = NaN;
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if score parameter is Infinity', () => {
        const level = "1";
        const score = Infinity;
        const wasCompleted = true;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if wasCompleted parameter is undefined', () => {
        const level = "1";
        const score = "100";
        const wasCompleted = undefined;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

    it('should throw error if wasCompleted parameter is null', () => {
        const level = "1";
        const score = "100";
        const wasCompleted = null;

        expect(() => {
            analytics.logLevelEnd(level, score, wasCompleted);
        }).toThrowError();
    });

});

describe('logLevelStart', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const level = "1";

        analytics.logLevelStart(level);

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_LEVEL_START);
    });

    it('should log level start when the level parameter is valid string', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1");

        expect(analytics.logLevelStartImpl).toHaveBeenCalledWith("1");
    });

    it('should log level start when the level parameter contains whitespace', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1 ");

        expect(analytics.logLevelStartImpl).toHaveBeenCalledWith("1 ");
    });

    it('should log level start when the level parameter contains special characters', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1!@#$%^&*()");

        expect(analytics.logLevelStartImpl).toHaveBeenCalledWith("1!@#$%^&*()");
    });

    it('should log level start when the level parameter is valid number', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart(1);

        expect(analytics.logLevelStartImpl).toHaveBeenCalledWith("1");
    });

    it('should convert the level parameter to string if it is a number', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart(1);

        expect(analytics.logLevelStartImpl).toHaveBeenCalledWith("1");
    });

    it('should set the internal game state level name to the level parameter', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1");

        expect(Wortal.session._internalGameState.setLevelName).toHaveBeenCalledWith("1");
    });

    it('should clear the internal game state level timer handle', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1");

        expect(Wortal.session._internalGameState.clearLevelTimerHandle).toHaveBeenCalled();
    });

    it('should reset the internal game state level timer', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1");

        expect(Wortal.session._internalGameState.resetLevelTimer).toHaveBeenCalled();
    });

    it('should start the internal game state level timer', () => {
        analytics.logLevelStartImpl = jest.fn();

        analytics.logLevelStart("1");

        expect(Wortal.session._internalGameState.startLevelTimer).toHaveBeenCalled();
    });

    it('should throw an error if the level parameter is invalid', () => {
        analytics.logLevelStartImpl = jest.fn();

        expect(() => {
            analytics.logLevelStart({});
        }).toThrow();
    });

    it('should throw an error if the level parameter is undefined', () => {
        analytics.logLevelStartImpl = jest.fn();

        expect(() => {
            analytics.logLevelStart(undefined);
        }).toThrow();
    });

    it('should throw an error if the level parameter is null', () => {
        analytics.logLevelStartImpl = jest.fn();

        expect(() => {
            analytics.logLevelStart(null);
        }).toThrow();
    });

    it('should throw an error if the level parameter is empty string', () => {
        analytics.logLevelStartImpl = jest.fn();

        expect(() => {
            analytics.logLevelStart("");
        }).toThrow();
    });

    it('should throw an error if the level parameter is NaN', () => {
        analytics.logLevelStartImpl = jest.fn();

        expect(() => {
            analytics.logLevelStart(NaN);
        }).toThrow();
    });

    it('should throw an error if the level parameter is Infinity', () => {
        analytics.logLevelStartImpl = jest.fn();

        expect(() => {
            analytics.logLevelStart(Infinity);
        }).toThrow();
    });

});

describe('logLevelUp', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logLevelUp("level");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_LEVEL_UP);
    });

    it('should log level up with a valid string parameter', () => {
        const logLevelUpImplSpy = jest.spyOn(analytics, 'logLevelUpImpl');

        analytics.logLevelUp("level");

        expect(logLevelUpImplSpy).toHaveBeenCalledWith("level");
    });

    it('should log level up with a valid number parameter', () => {
        const logLevelUpImplSpy = jest.spyOn(analytics, 'logLevelUpImpl');

        analytics.logLevelUp(5);

        expect(logLevelUpImplSpy).toHaveBeenCalledWith(5);
    });

    it('should log level up when level parameter contains whitespace', () => {
        const logLevelUpImplSpy = jest.spyOn(analytics, 'logLevelUpImpl');
        const whitespaceString = "level 1";

        analytics.logLevelUp(whitespaceString);

        expect(logLevelUpImplSpy).toHaveBeenCalledWith(whitespaceString);
    });

    it('should log level up when level parameter contains special characters', () => {
        const logLevelUpImplSpy = jest.spyOn(analytics, 'logLevelUpImpl');
        const specialString = "level!@#$%^&*()";

        analytics.logLevelUp(specialString);

        expect(logLevelUpImplSpy).toHaveBeenCalledWith(specialString);
    });

    it('should throw an error when calling logLevelUp with an invalid parameter type', () => {
        expect(() => {
            analytics.logLevelUp(true);
        }).toThrow();
    });

    it('should throw an error if the level parameter is an empty string', () => {
        expect(() => {
            analytics.logLevelUp("");
        }).toThrow();
    });

    it('should throw an error if the level parameter is null', () => {
        expect(() => {
            analytics.logLevelUp(null);
        }).toThrow();
    });

    it('should throw an error if the level parameter is undefined', () => {
        expect(() => {
            analytics.logLevelUp(undefined);
        }).toThrow();
    });

    it('should throw an error if the level parameter is NaN', () => {
        expect(() => {
            analytics.logLevelUp(NaN);
        }).toThrow();
    });

    it('should throw an error if the level parameter is Infinity', () => {
        expect(() => {
            analytics.logLevelUp(Infinity);
        }).toThrow();
    });

});

describe('logPurchase', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logPurchase("productID");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_PURCHASE);
    });

    it('should log a purchase with a valid productID string parameter', () => {
        const logPurchaseImplSpy = jest.spyOn(analytics, 'logPurchaseImpl');

        analytics.logPurchase("productID");

        expect(logPurchaseImplSpy).toHaveBeenCalledWith("productID", undefined);
    });

    it('should log a purchase with a valid productID string and details string parameters', () => {
        const logPurchaseImplSpy = jest.spyOn(analytics, 'logPurchaseImpl');

        analytics.logPurchase("productID", "details");

        expect(logPurchaseImplSpy).toHaveBeenCalledWith("productID", "details");
    });

    it('should log a purchase with a productID containing special characters', () => {
        const logPurchaseImplSpy = jest.spyOn(analytics, 'logPurchaseImpl');
        const specialString = "product!@#$%^&*()";

        analytics.logPurchase(specialString);

        expect(logPurchaseImplSpy).toHaveBeenCalledWith(specialString, undefined);
    });

    it('should log a purchase with a productID containing numbers', () => {
        const logPurchaseImplSpy = jest.spyOn(analytics, 'logPurchaseImpl');
        const numberString = "product123";

        analytics.logPurchase(numberString);

        expect(logPurchaseImplSpy).toHaveBeenCalledWith(numberString, undefined);
    });

    it('should throw an error if productID is not provided', () => {
        expect(() => {
            analytics.logPurchase();
        }).toThrow();
    });

    it('should throw an error if productID is an empty string', () => {
        expect(() => {
            analytics.logPurchase("");
        }).toThrow();
    });

    it('should throw an error if productID is not a string', () => {
        expect(() => {
            analytics.logPurchase(123);
        }).toThrow();
    });

    it('should throw an error if productID is null', () => {
        expect(() => {
            analytics.logPurchase(null);
        }).toThrow();
    });

    it('should throw an error if details is not a string', () => {
        expect(() => {
            analytics.logPurchase("productID", 123);
        }).toThrow();
    });

});

describe('logPurchaseSubscription', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logPurchaseSubscription("productID");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION);
    });

    it('should log a purchase subscription with valid productID', () => {
        const logPurchaseSubscriptionImplSpy = jest.spyOn(analytics, 'logPurchaseSubscriptionImpl');

        analytics.logPurchaseSubscription("productID");

        expect(logPurchaseSubscriptionImplSpy).toHaveBeenCalledWith("productID", undefined);
    });

    it('should log a purchase subscription with valid productID and details', () => {
        const logPurchaseSubscriptionImplSpy = jest.spyOn(analytics, 'logPurchaseSubscriptionImpl');

        analytics.logPurchaseSubscription("productID", "details");

        expect(logPurchaseSubscriptionImplSpy).toHaveBeenCalledWith("productID", "details");
    });

    it('should log a purchase subscription with productID containing special characters', () => {
        const logPurchaseSubscriptionImplSpy = jest.spyOn(analytics, 'logPurchaseSubscriptionImpl');
        const specialString = "product!@#$%^&*()";

        analytics.logPurchaseSubscription(specialString);

        expect(logPurchaseSubscriptionImplSpy).toHaveBeenCalledWith(specialString, undefined);
    });

    it('should log a purchase subscription with productID containing numbers', () => {
        const logPurchaseSubscriptionImplSpy = jest.spyOn(analytics, 'logPurchaseSubscriptionImpl');
        const numberString = "product123";

        analytics.logPurchaseSubscription(numberString);

        expect(logPurchaseSubscriptionImplSpy).toHaveBeenCalledWith(numberString, undefined);
    });

    it('should throw an error when productID is not provided', () => {
        expect(() => {
            analytics.logPurchaseSubscription();
        }).toThrow();
    });

    it('should throw an error when productID is not a string', () => {
        expect(() => {
            analytics.logPurchaseSubscription(123);
        }).toThrow();
    });

    it('should throw an error when productID is an empty string', () => {
        expect(() => {
            analytics.logPurchaseSubscription("");
        }).toThrow();
    });

    it('should throw an error when details is not a string', () => {
        expect(() => {
            analytics.logPurchaseSubscription("productID", 123);
        }).toThrow();
    });

});

describe('logScore', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logScore("100");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_SCORE);
    });

    it('should log score with a valid string parameter', () => {
        const logScoreImplSpy = jest.spyOn(analytics, 'logScoreImpl');

        analytics.logScore("100");

        expect(logScoreImplSpy).toHaveBeenCalledWith("100");
    });

    it('should log score with a valid number parameter', () => {
        const logScoreImplSpy = jest.spyOn(analytics, 'logScoreImpl');

        analytics.logScore(100);

        expect(logScoreImplSpy).toHaveBeenCalledWith(100);
    });

    it('should log score when score parameter contains whitespace', () => {
        const logScoreImplSpy = jest.spyOn(analytics, 'logScoreImpl');
        const whitespaceString = "100 ";

        analytics.logScore(whitespaceString);

        expect(logScoreImplSpy).toHaveBeenCalledWith(whitespaceString);
    });

    it('should log score when score parameter contains special characters', () => {
        const logScoreImplSpy = jest.spyOn(analytics, 'logScoreImpl');
        const specialString = "100!@#$%^&*()";

        analytics.logScore(specialString);

        expect(logScoreImplSpy).toHaveBeenCalledWith(specialString);
    });

    it('should throw an error if score is not a number or a string', () => {
        expect(() => {
            analytics.logScore(true);
        }).toThrow();
    });

    it('should throw an error if score is an empty string', () => {
        expect(() => {
            analytics.logScore("");
        }).toThrow();
    });

    it('should throw an error if score is null', () => {
        expect(() => {
            analytics.logScore(null);
        }).toThrow();
    });

    it('should throw an error if score is undefined', () => {
        expect(() => {
            analytics.logScore(undefined);
        }).toThrow();
    });

    it('should throw an error if score is NaN', () => {
        expect(() => {
            analytics.logScore(NaN);
        }).toThrow();
    });

    it('should throw an error if score is Infinity', () => {
        expect(() => {
            analytics.logScore(Infinity);
        }).toThrow();
    });

});

describe('logSocialInvite', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logSocialInvite("placement");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_SOCIAL_INVITE);
    });

    it('should log social invite with a valid string parameter', () => {
        const logSocialInviteImplSpy = jest.spyOn(analytics, 'logSocialInviteImpl');

        analytics.logSocialInvite("placement");

        expect(logSocialInviteImplSpy).toHaveBeenCalledWith("placement");
    });

    it('should log social invite when placement parameter contains whitespace', () => {
        const logSocialInviteImplSpy = jest.spyOn(analytics, 'logSocialInviteImpl');
        const whitespaceString = "   ";

        analytics.logSocialInvite(whitespaceString);

        expect(logSocialInviteImplSpy).toHaveBeenCalledWith(whitespaceString);
    });

    it('should log social invite when placement parameter contains special characters', () => {
        const logSocialInviteImplSpy = jest.spyOn(analytics, 'logSocialInviteImpl');
        const specialString = "!@#$%^&*()";

        analytics.logSocialInvite(specialString);

        expect(logSocialInviteImplSpy).toHaveBeenCalledWith(specialString);
    });

    it('should log social invite when placement parameter contains non-ASCII characters', () => {
        const logSocialInviteImplSpy = jest.spyOn(analytics, 'logSocialInviteImpl');
        const nonAsciiString = "日本語";

        analytics.logSocialInvite(nonAsciiString);

        expect(logSocialInviteImplSpy).toHaveBeenCalledWith(nonAsciiString);
    });

    it('should throw an error if the placement parameter is not a string', () => {
        expect(() => {
            analytics.logSocialInvite(123);
        }).toThrow();
    });

    it('should throw an error if the placement parameter is an empty string', () => {
        expect(() => {
            analytics.logSocialInvite("");
        }).toThrow();
    });

    it('should throw an error if the placement parameter is null', () => {
        expect(() => {
            analytics.logSocialInvite(null);
        }).toThrow();
    });

    it('should throw an error if the placement parameter is undefined', () => {
        expect(() => {
            analytics.logSocialInvite(undefined);
        }).toThrow();
    });

});

describe('logSocialShare', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logSocialShare("placement");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_SOCIAL_SHARE);
    });

    it('should log social share with a valid string parameter', () => {
        const logSocialShareImplSpy = jest.spyOn(analytics, 'logSocialShareImpl');

        analytics.logSocialShare("placement");

        expect(logSocialShareImplSpy).toHaveBeenCalledWith("placement");
    });

    it('should log social share when placement parameter contains whitespace', () => {
        const logSocialShareImplSpy = jest.spyOn(analytics, 'logSocialShareImpl');
        const whitespaceString = "   ";

        analytics.logSocialShare(whitespaceString);

        expect(logSocialShareImplSpy).toHaveBeenCalledWith(whitespaceString);
    });

    it('should log social share when placement parameter contains special characters', () => {
        const logSocialShareImplSpy = jest.spyOn(analytics, 'logSocialShareImpl');
        const specialString = "!@#$%^&*()";

        analytics.logSocialShare(specialString);

        expect(logSocialShareImplSpy).toHaveBeenCalledWith(specialString);
    });

    it('should log social share when placement parameter contains non-ASCII characters', () => {
        const logSocialShareImplSpy = jest.spyOn(analytics, 'logSocialShareImpl');
        const nonAsciiString = "日本語";

        analytics.logSocialShare(nonAsciiString);

        expect(logSocialShareImplSpy).toHaveBeenCalledWith(nonAsciiString);
    });

    it('should throw an error if the placement parameter is not a string', () => {
        expect(() => {
            analytics.logSocialShare(123);
        }).toThrow();
    });

    it('should throw an error if the placement parameter is an empty string', () => {
        expect(() => {
            analytics.logSocialShare("");
        }).toThrow();
    });

    it('should throw an error if the placement parameter is null', () => {
        expect(() => {
            analytics.logSocialShare(null);
        }).toThrow();
    });

    it('should throw an error if the placement parameter is undefined', () => {
        expect(() => {
            analytics.logSocialShare(undefined);
        }).toThrow();
    });

});

describe('logTutorialEnd', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logTutorialEnd();

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_TUTORIAL_END);
    });

    it('should log tutorial end with default parameters when called', () => {
        const logTutorialEndImplSpy = jest.spyOn(analytics, 'logTutorialEndImpl');

        analytics.logTutorialEnd();

        expect(logTutorialEndImplSpy).toHaveBeenCalledWith("Tutorial", true);
    });

    it('should log tutorial end with custom tutorial name and completion status when called', () => {
        const logTutorialEndImplSpy = jest.spyOn(analytics, 'logTutorialEndImpl');
        const tutorialName = "Custom Tutorial";
        const completionStatus = false;

        analytics.logTutorialEnd(tutorialName, completionStatus);

        expect(logTutorialEndImplSpy).toHaveBeenCalledWith(tutorialName, completionStatus);
    });

    it('should log tutorial end when tutorial name contains whitespace', () => {
        const logTutorialEndImplSpy = jest.spyOn(analytics, 'logTutorialEndImpl');
        const tutorialName = "Custom Tutorial ";

        analytics.logTutorialEnd(tutorialName);

        expect(logTutorialEndImplSpy).toHaveBeenCalledWith(tutorialName, true);
    });

    it('should log tutorial end when tutorial name contains special characters', () => {
        const logTutorialEndImplSpy = jest.spyOn(analytics, 'logTutorialEndImpl');
        const tutorialName = "Custom Tutorial!@#$%^&*()";

        analytics.logTutorialEnd(tutorialName);

        expect(logTutorialEndImplSpy).toHaveBeenCalledWith(tutorialName, true);
    });

    it('should log tutorial end when tutorial name contains non-ASCII characters', () => {
        const logTutorialEndImplSpy = jest.spyOn(analytics, 'logTutorialEndImpl');
        const tutorialName = "日本語";

        analytics.logTutorialEnd(tutorialName);

        expect(logTutorialEndImplSpy).toHaveBeenCalledWith(tutorialName, true);
    });

    it('should reset level timer if tutorial name does not match current level name', () => {
        const clearLevelTimerHandleSpy = jest.spyOn(Wortal.session._internalGameState, 'clearLevelTimerHandle');
        const resetLevelTimerSpy = jest.spyOn(Wortal.session._internalGameState, 'resetLevelTimer');
        const logTutorialEndImplSpy = jest.spyOn(analytics, 'logTutorialEndImpl');
        const tutorialName = "Custom Tutorial";

        Wortal.session._internalGameState.levelName = "Other Level";

        analytics.logTutorialEnd(tutorialName);

        expect(clearLevelTimerHandleSpy).toHaveBeenCalled();
        expect(resetLevelTimerSpy).toHaveBeenCalled();
        expect(logTutorialEndImplSpy).toHaveBeenCalledWith(tutorialName, true);
    });

    it('should throw an error if tutorial name is not a string', () => {
        expect(() => {
            analytics.logTutorialEnd(123, true);
        }).toThrow();
    });

    it('should throw an error if tutorial name is null', () => {
        expect(() => {
            analytics.logTutorialEnd(null, true);
        }).toThrow();
    });

    it('should throw an error if completion status is not a boolean', () => {
        expect(() => {
            analytics.logTutorialEnd("Tutorial", "true");
        }).toThrow();
    });

    it('should throw an error if completion status is null', () => {
        expect(() => {
            analytics.logTutorialEnd("Tutorial", null);
        }).toThrow();
    });

});

describe('logTutorialStart', () => {
    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logTutorialStart("tutorial");

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_TUTORIAL_START);
    });

    it('should log tutorial start with default tutorial name when called', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        analytics.logTutorialStart();

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ANALYTICS_LOG_TUTORIAL_START);
    });

    it('should log tutorial start with custom tutorial name when called', () => {
        const logTutorialStartImplSpy = jest.spyOn(analytics, 'logTutorialStartImpl');
        const tutorialName = "Custom";

        analytics.logTutorialStart(tutorialName);

        expect(logTutorialStartImplSpy).toHaveBeenCalledWith(tutorialName);
    });

    it('should log tutorial start when tutorial name contains whitespace', () => {
        const logTutorialStartImplSpy = jest.spyOn(analytics, 'logTutorialStartImpl');
        const tutorialName = "Custom Tutorial ";

        analytics.logTutorialStart(tutorialName);

        expect(logTutorialStartImplSpy).toHaveBeenCalledWith(tutorialName);
    });

    it('should log tutorial start when tutorial name contains special characters', () => {
        const logTutorialStartImplSpy = jest.spyOn(analytics, 'logTutorialStartImpl');
        const tutorialName = "Custom Tutorial!@#$%^&*()";

        analytics.logTutorialStart(tutorialName);

        expect(logTutorialStartImplSpy).toHaveBeenCalledWith(tutorialName);
    });

    it('should log tutorial start when tutorial name contains non-ASCII characters', () => {
        const logTutorialStartImplSpy = jest.spyOn(analytics, 'logTutorialStartImpl');
        const tutorialName = "日本語";

        analytics.logTutorialStart(tutorialName);

        expect(logTutorialStartImplSpy).toHaveBeenCalledWith(tutorialName);
    });

    it('should set level name to tutorial name', () => {
        const setLevelNameSpy = jest.spyOn(Wortal.session._internalGameState, 'setLevelName');

        analytics.logTutorialStart("tutorial");

        expect(setLevelNameSpy).toHaveBeenCalledWith("tutorial");
    });

    it('should clear level timer handle', () => {
        const clearLevelTimerHandleSpy = jest.spyOn(Wortal.session._internalGameState, 'clearLevelTimerHandle');

        analytics.logTutorialStart("tutorial");

        expect(clearLevelTimerHandleSpy).toHaveBeenCalled();
    });

    it('should reset level timer', () => {
        const resetLevelTimerSpy = jest.spyOn(Wortal.session._internalGameState, 'resetLevelTimer');

        analytics.logTutorialStart("tutorial");

        expect(resetLevelTimerSpy).toHaveBeenCalled();
    });

    it('should start level timer', () => {
        const startLevelTimerSpy = jest.spyOn(Wortal.session._internalGameState, 'startLevelTimer');

        analytics.logTutorialStart("tutorial");

        expect(startLevelTimerSpy).toHaveBeenCalled();
    });

    it('should throw an error if tutorial name is not a string', () => {
        expect(() => {
            analytics.logTutorialStart(123);
        }).toThrow();
    });

    it('should throw an error if tutorial name is null', () => {
        expect(() => {
            analytics.logTutorialStart(null);
        }).toThrow();
    });

});
