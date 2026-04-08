import { Loginresponse , LoginRequest} from "../schema/login-schema";

export async function loginUser(loginRequest : LoginRequest) : Promise<Loginresponse> {
    const formData = new URLSearchParams();
    formData.append("username",loginRequest.email);
    formData.append("password",loginRequest. password);

    const res = await fetch("http://localhost:8000/user/login",{
        method : "POST",
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
    body : formData,

    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    const data : Loginresponse = await res.json();

    return data;
}   