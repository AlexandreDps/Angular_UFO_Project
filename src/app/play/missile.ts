import { Ufo } from './ufo';

export class Missile {

    private meteorite: HTMLImageElement;
    private meteorite_speed: number;
    private fire_speed: number;
    private score: HTMLElement | null;
    public pid_movemissile: NodeJS.Timeout | undefined;
    public keys: { right: boolean; left: boolean; space:boolean } = {
        right: false,
        left: false,
        space: false
      };
    private firedMissile: boolean = false;
    public all_dinos:Ufo[]|undefined;

    constructor(meteorite: HTMLImageElement, meteorite_speed: number,
        fire_speed:number, score:HTMLElement|null) {
        this.meteorite = meteorite;
        this.meteorite_speed = meteorite_speed;
        this.fire_speed = fire_speed;
        this.score = score;
    }

    moveMissile() {
        if (this.keys.left) {
          this.moveLeft()
        }
        if (this.keys.right) {
            this.moveRight();
        }
        if (this.keys.space) {
          if (!this.firedMissile) {
            clearInterval(this.pid_movemissile);
            
            this.launch();
            if (this.meteorite!=null) {
              this.meteorite.src = "../../assets/imgs/meteor.gif";
              this.firedMissile = true;
            }
          }
        }
      }

    moveLeft(): void {
        const newpos: number = this.meteorite.offsetLeft - this.meteorite_speed;
        if (newpos > 0 && newpos < window.innerWidth) {
          this.meteorite.style.left = `${newpos}px`;
        }
    }

    moveRight() {
        const newpos : number = this.meteorite.offsetLeft + this.meteorite_speed;
        if (newpos > 0 && newpos < window.innerWidth-115) {
            this.meteorite.style.left = `${newpos}px`;
        }
    }

    isColliding(element1: HTMLElement, element2: HTMLElement): boolean {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
    win_shot() {
        if (this.score!=null && this.score.textContent !== null) {
            this.score.textContent = (parseInt(this.score.textContent) + 100).toString();
        }
    }
    lost_shot() {
        if (this.score!=null && this.score.textContent !== null) {
            this.score.textContent = (parseInt(this.score.textContent) - 25).toString();
        }
    }
    launch() {
        this.pid_movemissile = setInterval(() => {
            if (this.all_dinos != null) {
                this.launch_anim(this.all_dinos);
            }
          }, 10);

      }
    
    kill_dino(dino:Ufo) {
        //In fact we just add some points and respawn him
        if (this.all_dinos !=null) {
            this.all_dinos.splice(this.all_dinos.indexOf(dino), 1); // We remove our dino from our array first so he doesn't move while dying
            dino.stop_dino();
            dino.element.src="../../assets/imgs/die.gif";
            this.meteorite.style.display = "None"; //Make it disappear temporarily
            setTimeout(() => {
                dino.element.remove(); // We remove dino from the screen
                const new_dino = new Ufo(dino.dino_height,dino.dino_speed, dino.dino_list); // And we create a new dino
                if (this.all_dinos !=null) {this.all_dinos.push(new_dino);}
                this.meteorite.style.display = "block";
              }, 1400);
        }
    }
    launch_anim(dinos: Ufo[]) {
        let newpos = this.meteorite.offsetTop + this.fire_speed;
        let collision = false;
      
        for (let i = 0; i < dinos.length; i++) {
          if (this.isColliding(this.meteorite, dinos[i].element)) {
            collision = true;
            this.kill_dino(dinos[i]);
            break;
          }
        }
      
        if (newpos < window.innerHeight + 20 && !collision) {
          this.meteorite.style.top = `${newpos}px`;
        } else {
          if (collision) {
            this.win_shot();
            this.reset_missile(1400);
          } else {
            this.lost_shot();
            this.reset_missile(0);
          }
        }
    }
    
    reset_missile(time: number): void {
        this.meteorite.style.top = '145px';
        clearInterval(this.pid_movemissile);
        this.meteorite.src = "../../assets/imgs/meteor.png";
        setTimeout(() => {
            this.firedMissile = false;
              this.pid_movemissile = setInterval(() => {
                this.moveMissile();
              }, 10);
        }, time); // Reloading time including animation time
      }



}