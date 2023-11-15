import {
    StatFormat_AddictingGames,
    StatMode_AddictingGames,
    StatType_AddictingGames
} from "../types/addictinggames-stat-types";

/**
 * Interface for the stat config of the AddictingGames stats.
 * @hidden
 */
export interface StatConfig_AddictingGames {
    game: string,
    name: string,
    level_key: string,
    value_name?: string,
    value_type?: StatType_AddictingGames,
    value_formatter?: StatFormat_AddictingGames,
    order?: number,
    reverse?: boolean,
    mode?: StatMode_AddictingGames
}
