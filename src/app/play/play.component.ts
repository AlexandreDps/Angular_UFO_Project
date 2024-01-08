import { Component,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Missile } from './missile';
import { Ufo } from './ufo';
import { is_logged } from '../auth_verification';
import { newToken } from '../auth_verification';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent {
  can_save_score = false;
  game_ended = false;
  meteorite_speed: number = parseInt(sessionStorage.getItem("meteor_speed") || "5");
  fire_speed: number = parseInt(sessionStorage.getItem("shoot_speed") || "4");
  dino_speed: number = parseInt(sessionStorage.getItem("dino_speed") || "2");
  dino_number: number = parseInt(sessionStorage.getItem("nb_dino") || "1");
  time_limit: number = parseInt(sessionStorage.getItem("time_limit") || "60");
  remainingTime = this.time_limit;
  dino_list: string[] = ["Dino1.png", "Dino2.png", "Dino3.png"];
  dinos: Ufo[] = [];
  dino_height: number = 100;
  collision: boolean = false;
  meteorite: HTMLImageElement | null = null;
  missile : Missile | undefined;
  score: HTMLElement | null = null;
  time: HTMLElement | null = null;
  pid_timer_decrease: NodeJS.Timeout | undefined;

  constructor(private http: HttpClient) {
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowLeft" && this.missile != null) {
      this.missile.keys.left = true;
    }
    if (event.key === "ArrowRight" && this.missile != null) {
      this.missile.keys.right = true;
    }
    if (event.key === " " && this.missile != null) {
      this.missile.keys.space = true;
    }
  }
  
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === "ArrowLeft" && this.missile != null) {
      this.missile.keys.left = false;
    }
    if (event.key === "ArrowRight" && this.missile != null) {
      this.missile.keys.right = false;
    }
    if (event.key === " " && this.missile != null) {
      this.missile.keys.space = false;
    }
  }
  dino_init(): void {
    for (let i = 0; i < this.dino_number; i++) {
      const dino = new Ufo(this.dino_height,this.dino_speed, this.dino_list);
      this.dinos.push(dino);
    }
  
    

    if (this.missile !=null) {this.missile.all_dinos = this.dinos}
  }

  decrement_timer() {
    this.remainingTime -= 1;
    if (this.time!=null && this.remainingTime>-1) {this.time.textContent = this.remainingTime.toString();}
    if (this.remainingTime==0) {
      setTimeout(() => this.end(), 500);
    }
  }

  end() {
    //Clear all pids
    clearInterval(this.pid_timer_decrease);
    clearInterval(this.missile!.pid_movemissile);
    for (let dino of this.dinos) {
      clearInterval(dino.pid_dino_move);
    }
    this.game_ended = true;
    if (this.is_logged_check()) {
      window.alert("Time's Up ! You will be able to save your score !");
      this.can_save_score = true;
    }
    else {
      window.alert("Time's Up ! Next time you should login to save your score !");
    }
  }
  is_logged_check() {
    return is_logged();
  }
  restart() {
    window.location.href = "play";
  }
  async save_score() {
    //Store the final score
    let ending_score = this.score!.textContent!
    let final_score = parseInt(ending_score)/(this.time_limit/60) - this.dino_number*50;
    if (this.is_logged_check()) {
      //We recheck in case the session has expired between game ended and button pressed
      let apiUrl = 'http://wd.etsisi.upm.es:10000/records';
      let token = JSON.parse(sessionStorage.getItem('authToken')!).token;
      let headers = new HttpHeaders({ 'Authorization': token });
      let body = {
        punctuation : final_score,
        ufos:this.dino_number,
        disposedTime : this.time_limit,
      };
      this.http
        .post<any>(apiUrl, body, {
          headers: headers,
          params: body,
        })
        .subscribe(
          (response) => {
            window.alert("Score successfully saved ! Don't hesitate so check your /records to see if you have improved !");
          },
          (error) => {
            window.alert(`Something went wrong : ${error.error}`);
          }
        );
      //And we renew the token with reseted expiration time
      newToken(this.http);
    }
    this.can_save_score = false;
  }

  ngAfterViewInit(): void {
    document.body.style.setProperty('background-image', 'url("../../assets/imgs/bg_play.png")');
    this.meteorite = document.getElementById("meteorite") as HTMLImageElement;
    if (this.meteorite != null) {
      this.score = document.getElementById("score_value");
      this.time = document.getElementById("time_value");
      this.missile = new Missile(this.meteorite, this.meteorite_speed, this.fire_speed, this.score)
      window.addEventListener("keydown", (event) => {
        this.handleKeyDown(event);
      });
      window.addEventListener("keyup", (event) => {
        this.handleKeyUp(event);
      });
      if (this.missile != null) {
        this.missile.pid_movemissile = setInterval(() => {
          if (this.missile != null) {
          this.missile.moveMissile();}
        }, 10);
      }
      this.dino_init();
      this.pid_timer_decrease = setInterval(() => this.decrement_timer(), 1000);
    }
  }

  ngOnDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
  
}
