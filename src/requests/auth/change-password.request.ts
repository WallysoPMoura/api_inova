export type ChangePasswordRequest = {
    password: string;
    passwordConfirmation: string;
    token: string;
}