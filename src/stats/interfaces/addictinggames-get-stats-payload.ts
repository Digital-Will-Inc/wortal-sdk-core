import { StatFormat_AddictingGames, StatType_AddictingGames } from "../types/addictinggames-stat-types";
import { StatPeriod } from "../types/stat-types";

/**
 * Payload of the GetStats API in the AddictingGames implementation.
 * https://github.com/TeachMeInc/swag-api-js/blob/master/swag-api-developers.md#getscores-options
 * @hidden
 */
export interface GetStatsPayload_AddictingGames {
    level_key: string;
    type?: StatType_AddictingGames;
    period?: StatPeriod;
    current_user?: boolean;
    target_date?: string;
    use_daily?: boolean;
    value_formatter?: StatFormat_AddictingGames;
}
