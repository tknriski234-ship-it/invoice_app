import { apiFetch } from "@/lib/api";

export function GetUser(payload){
    return apiFetch("users/login",{
        method : "GET",
        body : JSON.stringify(payload)
    })
}

