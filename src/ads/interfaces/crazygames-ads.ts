import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";

/**
 * Ad callbacks used by CrazyGames. These get mapped to Wortal AdCallbacks at runtime.
 * @see AdCallbacks
 * @hidden
 */
export interface AdCallbacks_CrazyGames {
    adStarted: () => void;
    adFinished: () => void;
    adError: (error: Error_CrazyGames) => void;
}
