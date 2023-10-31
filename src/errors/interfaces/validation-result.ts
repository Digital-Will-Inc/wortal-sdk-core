import { ErrorMessage } from "./error-message";

/**
 * Result from a validation function. Return these in validation functions to indicate whether the validation passed or failed.
 * The caller should throw an error if the validation failed.
 * @example
 * const validationResult = this.validateCreateAsync(playerID);
 * if (!validationResult.valid) {
 *    return Promise.reject(validationResult.error);
 *    // or
 *    throw validationResult.error;
 * }
 * @hidden
 */
export interface ValidationResult {
    valid: boolean;
    error?: ErrorMessage;
}
