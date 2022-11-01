import {GroupRequest} from "../types/social-group";
import {sdk} from "./index";

/**
 * Opens the platform UI to select friends to invite and play with.
 */
export function chooseGroupAsync(options: GroupRequest): Promise<void> {
    if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
        return (window as any).wortalGame
            .context.chooseAsync()
            .then((_: any) => console.log((window as any).wortalGame.context.getID()))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Groups not currently supported on platform: " + sdk.session.platform);
    }
}

export function createGroupAsync() {

}

export function switchGroupAsync() {

}
