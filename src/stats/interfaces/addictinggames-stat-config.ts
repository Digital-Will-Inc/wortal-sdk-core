import {
    StatFormat_AddictingGames,
    StatMode_AddictingGames,
} from "../types/addictinggames-stat-types";
import { StatValueType } from "../types/stat-types";

/**
 * Interface for the stat config of the AddictingGames stats.
 * @hidden
 */
export interface StatConfig_AddictingGames {
    game: string,
    name: string,
    level_key: string,
    value: number,
    value_name?: string,
    value_type?: StatValueType,
    value_formatter?: StatFormat_AddictingGames,
    order?: number,
    reverse?: boolean,
    mode?: StatMode_AddictingGames
}
