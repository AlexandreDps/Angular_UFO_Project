import { Login } from './login/login.component';
import { HttpClient } from '@angular/common/http';

export function newToken(http: HttpClient) {
    let username = sessionStorage.getItem('username')!;
    let password = sessionStorage.getItem('password')!;
    new Login(http,username,password);
}

export function is_logged() :boolean {
    let token = sessionStorage.getItem('authToken')
    if (token != null) {
        let token_infos = JSON.parse(token);
        let now = new Date().getTime();
        if (now > token_infos.expirationTime) {
            //Expiration
            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("password");
            window.alert("Session has expired");
            return false
        }
        return true;
    }
    else {
        return false;
    }
}