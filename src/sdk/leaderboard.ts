import Leaderboard from "../models/leaderboard";
import {sdk} from "./index";

export function getLeaderboardAsync(name: string): Promise<Leaderboard> {
    if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
        return (window as any).wortalGame
            .getLeaderboardAsync(name)
            .then((result: any) => new Leaderboard(result.id, result.name, result.contextId))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + sdk.session.platform);
    }
}
