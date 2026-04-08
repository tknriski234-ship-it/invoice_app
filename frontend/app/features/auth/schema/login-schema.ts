export type LoginRequest = {
    email : string;
    password : string;
}

export type Loginresponse = {
    access_token : string;
    token_type : string;
}
