// Module helpers for Auth: initial slice state + Firebase error → user-facing message resolution.
import type { UserState } from "@/interfaces/auth";
import type { FirebaseAuthError } from "@/utils/model";

/** Default user slice state — signed-out, no tokens, no profile, no error. */
export const createInitialUserState = (): UserState => ({
    isLoggedIn: false,
    authState: "signed_out",
    accessToken: "",
    refreshToken: "",
    idToken: "",
    details: null,
    loading: false,
    error: "",
});

/** Maps Firebase auth error codes to user-facing copy shown by the login form. */
export const FIREBASE_AUTH_ERROR_MAP: Record<string, string> = {
    "auth/user-not-found": "User does not exist. Please register first.",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-email": "Invalid email address",
    "auth/too-many-requests": "Too many attempts. Try again later.",
};

/** Returns a human-readable message for a Firebase auth error using the code map, then falling back to `message`. */
export function resolveFirebaseAuthMessage(error: FirebaseAuthError): string {
    return (
        FIREBASE_AUTH_ERROR_MAP[error.code ?? ""] ??
        error.message ??
        "Something went wrong"
    );
}

/** True when the Firebase error indicates an MFA challenge is required (caller should branch to the OTP UI). */
export function isMfaChallenge(error: FirebaseAuthError): boolean {
    return error.code === "auth/multi-factor-auth-required";
}

/** Extracts the MFA challenge data Firebase ships on the error object. */
export function extractMfaChallengeFromError(error: FirebaseAuthError): {
    resolver: unknown;
    phoneNumber: string | undefined;
} {
    return {
        resolver: error.resolver,
        phoneNumber: error.customData?._tokenResponse?.mfaInfo?.[0]?.phoneInfo,
    };
}
