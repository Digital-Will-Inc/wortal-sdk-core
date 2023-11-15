import Wortal from "./index";

export function getWaves(): Waves {
    if (!Waves) {
        throw new Error("Waves SDK not found.")
    }
    if (!window.waves) {
        window.waves = new Waves({
            gameId: parseInt(Wortal.session._internalSession.gameID),
            platform: Wortal.session.getPlatform()
        });
    }
    return window.waves;
}
