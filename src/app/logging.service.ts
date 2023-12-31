import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class LoggingService{
    lastlog:string;

    printLog(message: string){
        console.log("The message: "+message);
        console.log("The last log: "+this.lastlog);
        this.lastlog = message;
    }
}