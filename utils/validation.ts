/**
 * Regex and shared validation messages (aligned with purpose-codes-platform-user-panel patterns).
 */

export const isValid = (name: string) => /^[a-zA-Z ]+$/.test(name);

export const passwordError =
  "Please enter minimum 8 character password with at least 1 uppercase, one numeric digit, 1 lower case & 1 special character.";

export const passRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.* ).{8,40}$/;

export const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const zipRegExp = /[1-9]{1}[0-9]{2}[0-9]{3}$/;

export const nameRegExp = /^([a-zA-Z ]){2,20}$/;
