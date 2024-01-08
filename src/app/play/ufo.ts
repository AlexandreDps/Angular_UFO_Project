export class Ufo {

    public element: HTMLImageElement;
    private direction : number;
    public dino_height :number;
    public dino_list:string[];
    public dino_speed:number;
    pid_dino_move: NodeJS.Timeout;
    constructor(dino_height:number, dino_speed:number, dino_list:string[]) {
        this.dino_height = dino_height;
        this.dino_list = dino_list;
        this.dino_speed = dino_speed;
        const dino = new Image();
        const randomIndex: number = Math.floor(Math.random() * dino_list.length); // Multiple dinosaurs
        const randomTop: string = this.getRandomNumber(300, window.innerHeight - dino_height) + 'px';
        const randomLeft: string = this.getRandomNumber(dino.offsetWidth, window.innerWidth - dino_height * 1.6) + 'px'; // Multiply by 1.6 because it's my worth image ratio
      
        dino.style.height = `${dino_height}px`;
        dino.src = "../../assets/imgs/" + dino_list[randomIndex];
        dino.style.position = 'absolute';
        dino.style.top = randomTop;
        dino.style.left = randomLeft;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        dino.style.transform = `scaleX(${this.direction * -1})`;
        this.element = dino;
        document.body.appendChild(dino);
        this.pid_dino_move = setInterval(() => {
            this.move_dino(dino_speed);
        }, 25);
    }


    getRandomNumber(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    move_dino(dino_speed:number) {
        let dino = this.element;
        let newpos = dino.offsetLeft + dino_speed*this.direction;
        if (newpos < 0 || newpos > (window.innerWidth - dino.offsetWidth)) {
            this.direction*=-1;
            newpos = dino.offsetLeft + dino_speed*this.direction;
            dino.style.transform = `scaleX(${this.direction*-1})`;
        }
        dino.style.left = `${newpos}px`;
    }

    stop_dino() {
        clearInterval(this.pid_dino_move);
    }
}