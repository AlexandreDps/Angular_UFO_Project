import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { is_logged } from '../auth_verification';
import { newToken } from '../auth_verification';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent {
    personal_records = false;
    uname: string|undefined|null;
    constructor(private http: HttpClient) {
        this.is_logged_check();
        this.initializeRecords();
    }
    
    async initializeRecords() {
        let data = await this.get_all_records();
        this.display(data,"result_table");
    }

    async initializePersonalRecords() {
        let data = await this.get_personnal_records();
        this.display(data,"personnal_table",false);
        //And we renew the token
        newToken(this.http);
    }

    is_logged_check() {
        if (is_logged()) {
            this.personal_records = true;
            this.uname = sessionStorage.getItem("username");
            this.initializePersonalRecords();
        }
    }

    is_logged_checkb() {
        return is_logged(); //This one is for the reactive component
        //So if we visualize records and disconnect the personnal table will
        //dissapear as we are logout.
    }

    async get_all_records() {
        let apiUrl = `http://wd.etsisi.upm.es:10000/records`;
        try {
            let response = await this.http.get<any>(apiUrl).toPromise();
            return response;
        } catch (error) {
            window.alert(`${(error as any).error} you may try again later`);
            window.location.href = "home";
            return null;
        }
    }

    async get_personnal_records() {
        let apiUrl = `http://wd.etsisi.upm.es:10000/records/${this.uname}`;
        let token = JSON.parse(sessionStorage.getItem('authToken')!).token;
        let headers = new HttpHeaders({ 'Authorization': token });
        try {
            let response = await this.http.get<any>(apiUrl, {headers}).toPromise();
            return response;
        } catch (error) {
            window.alert(`${(error as any).error} you may try again later`);
            window.location.href = "home";
            return null;
        }
    }
    
    display(data:any,target:string,show_active=true) {
        let html_to_compile = `
        <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>Punctuation</th>
        <th>Ufo's</th>
        <th>Disposed Time</th>
        <th>Record Date</th>
        </tr>
        `;
        data.forEach((row : any, index: any) => {
            if (this.personal_records && row.username == this.uname && show_active) {
                html_to_compile += "<tr class='active'>"
            }
            else {
                html_to_compile += "<tr>"
            }
            html_to_compile += `
            <td>${index+1}</td>
            <td>${row.username}</td>
            <td>${row.punctuation}</td>
            <td>${row.ufos}</td>
            <td>${row.disposedTime}</td>
            <td>${this.format_date(row.recordDate)}</td>
            </tr>`
        });
        document.getElementById(target)!.innerHTML=html_to_compile;
        document.getElementById(target)!.classList.add('generated_tab');
    } 

    format_date(timestamp:number) {
        let date = new Date(timestamp);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        //Format the date as 'dd/mm/yyyy'
        let formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }

}
