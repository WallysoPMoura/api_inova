export type ChangePasswordRequest = {
    password: string;
    password_confirmation: string;
    token: string;
}