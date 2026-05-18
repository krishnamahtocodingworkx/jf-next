// Regex + error-message constants shared by every Yup auth schema.

/** Letters-and-spaces validator (used in legacy spots). */
export const isValid = (name: string) => /^[a-zA-Z ]+$/.test(name);

/** Copy shown when a password fails the strength regex below. */
export const passwordError =
  "Please enter minimum 8 character password with at least 1 uppercase, one numeric digit, 1 lower case & 1 special character.";

/** Strong-password rule: ≥1 lower, upper, digit, special; no whitespace; length 8–40. */
export const passRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.* ).{8,40}$/;

/** Optional country code + 10-digit phone number. */
export const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

/** Lightweight email validator (paired with backend validation for stricter checks). */
export const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

/** 6-digit ZIP code (legacy form field). */
export const zipRegExp = /[1-9]{1}[0-9]{2}[0-9]{3}$/;

/** First/last name — letters and spaces only, 2–20 characters. */
export const nameRegExp = /^([a-zA-Z ]){2,20}$/;
