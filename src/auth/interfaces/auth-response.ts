import { AuthStatus } from "../types/auth-types";

/**
 * Response from the authentication process.
 */
export interface AuthResponse {
    status: AuthStatus;
}
