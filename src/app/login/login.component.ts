import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { is_logged } from '../auth_verification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private http: HttpClient,private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login() {
    let username = this.loginForm.get('username')!.value;
    let password = this.loginForm.get('password')!.value;
    new Login(this.http,username,password);
  }

  is_logged_check() {
    return is_logged();
  }
  
}

export class Login {
  
  constructor(private http: HttpClient,private username:string,private password:string) { 
    let apiUrl = `http://wd.etsisi.upm.es:10000/users/login`;
    let params = {
      username: username,
      password: password,
    };
    this.http
    .get<any>(apiUrl, { params: params })
    .subscribe(
      (response) => {
        //We store password and username in the session to renew the token when needed 
        //And we also store the token with a validity of 10minutes
        const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes in milliseconds
        const tokenData = {
          token: response,
          expirationTime: expirationTime,
        };
        sessionStorage.setItem('authToken', JSON.stringify(tokenData));
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('username', username);
      },
      (error) => {
        window.alert(error.error);
        (document.getElementById("password") as HTMLInputElement).value = "";
      }
    );
  }
}