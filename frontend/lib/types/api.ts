export interface RegisterRequest {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    access_token: string;
    refresh_token: string;
}