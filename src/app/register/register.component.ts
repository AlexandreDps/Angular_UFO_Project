import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../login/login.component';
import { is_logged } from '../auth_verification';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private http: HttpClient,private fb: FormBuilder) { 
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      verify_password: ['', Validators.required]
    });
  }
  
  async handleRegister() {
    let username = this.registerForm.get('username')!.value;
    let email= this.registerForm.get('email')!.value;
    let password= this.registerForm.get('password')!.value;
    let password_confirm= this.registerForm.get('verify_password')!.value;
    
    if (password != password_confirm) {
      window.alert("Error : password and repeat password doesn't match");
      //reset passwords fields
      (document.getElementById("password") as HTMLInputElement).value = "";
      (document.getElementById("verify_password") as HTMLInputElement).value = "";
    }
    else {
      //Verify uniqueness
      if (await this.canContinue(username) == false) {
        (document.getElementById("username") as HTMLInputElement).value = "";
      }
      else {
        this.registering(username,password,email)
      }
    }
  }

  async canContinue(user: string): Promise<boolean> {
    let apiUrl = `http://wd.etsisi.upm.es:10000/users/${user}`;
  
    try {
      await this.http.get(apiUrl).toPromise();
      window.alert("username to indicate already exists");
    } catch (error:any) {
      if (error.status==404) {
        return true; //User doesn't exists
      }
      else {
        window.alert(error.statusText)
      }
    }
    return false;
  }
  registering(username:string,password:string, email:string) {
    let apiUrl = 'http://wd.etsisi.upm.es:10000/users';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let body = {
      username: username,
      email:email,
      password: password,
    };
    this.http
      .post<any>(apiUrl, body, {
        headers: headers,
        params: body,
      })
      .subscribe(
        (response) => {
          window.alert("Account successfully created !");
          //We also automatically login because we successfully registered
          new Login(this.http,username,password);
        },
        (error) => {
          window.alert(`Something went wrong : ${error.statusText}`);
        }
      );
  }

  is_logged_check() {
    return is_logged();
  }
}
