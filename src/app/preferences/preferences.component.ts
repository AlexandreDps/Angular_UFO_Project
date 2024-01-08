import { Component } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {

  loadValues(): void {
    let meteoriteSpeed: number = parseInt(sessionStorage.getItem("meteor_speed") || "5");
    let fireSpeed: number = parseInt(sessionStorage.getItem("shoot_speed") || "4");
    let dinoSpeed: number = parseInt(sessionStorage.getItem("dino_speed") || "2");
    let dinoNumber: number = parseInt(sessionStorage.getItem("nb_dino") || "1");
    let remainingTime: number = parseInt(sessionStorage.getItem("time_limit") || "60");

    (document.getElementById("dinonumber") as HTMLInputElement).value = dinoNumber.toString();
    (document.getElementById("time_limit") as HTMLInputElement).value = remainingTime.toString();
    (document.getElementById("mspeed") as HTMLInputElement).value = meteoriteSpeed.toString();
    (document.getElementById("sspeed") as HTMLInputElement).value = fireSpeed.toString();
    (document.getElementById("dspeed") as HTMLInputElement).value = dinoSpeed.toString();
  }

  ngAfterViewInit(): void {
    let submitButton: HTMLElement | null = document.getElementById('submitbutton');
    if (submitButton) {
      this.loadValues(); // If the user has already modified some settings, it will be loaded so its previous settings are not forgotten.
                         // If not, we will load default values.
      submitButton.addEventListener('click', function (event) {
        let nbDino: number = parseInt((document.getElementById("dinonumber") as HTMLInputElement).value);
        let timeLimit: number = parseInt((document.getElementById("time_limit") as HTMLInputElement).value);
        let meteorSpeed: number = parseInt((document.getElementById("mspeed") as HTMLInputElement).value);
        let shootSpeed: number = parseInt((document.getElementById("sspeed") as HTMLInputElement).value);
        let dinoSpeed: number = parseInt((document.getElementById("dspeed") as HTMLInputElement).value);

        sessionStorage.setItem("nb_dino", nbDino.toString());
        sessionStorage.setItem("time_limit", timeLimit.toString());
        sessionStorage.setItem("meteor_speed", meteorSpeed.toString());
        sessionStorage.setItem("dino_speed", dinoSpeed.toString());
        sessionStorage.setItem("shoot_speed", shootSpeed.toString());

        window.alert("Settings Successfully Saved ! \nYou can now try them in Play Mode ;-)");
      });
    }
  };
}
