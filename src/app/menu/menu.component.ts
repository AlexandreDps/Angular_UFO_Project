import { Component } from '@angular/core';
import { is_logged } from '../auth_verification';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {  
  user : string | null | undefined;
  is_logged_check() {
    let response = is_logged();
    if (response) {
      this.user = sessionStorage.getItem("username")!;
    }
    else {this.user=null}
    return response;
  }

  disconnect() {
    sessionStorage.clear(); //Destroy session
    window.alert("Disconnected");
  }
}
