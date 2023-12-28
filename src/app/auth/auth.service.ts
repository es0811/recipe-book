import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import {environment} from '../../environments/environment'

 export interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn:'root'
})
export class AuthService{
    user =  new BehaviorSubject<User>(null);
    private tokenExpirationTimer:any;

    constructor(private http:HttpClient, private router: Router){};

    signup(email:string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp',{
            email: email,
            password: password,
            returnSecureToken: true,
        },
        {
            params:{
                key: environment.firebaseAPIKey
            },
        }
        )
        .pipe(catchError(this.handleError),tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken,+resData.expiresIn);
        }));
    }

    private handleAuthentication(email: string, id:string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, id, token, expirationDate);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        this.autoLogout(expiresIn*1000);
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',{
            email: email,
            password: password,
            returnSecureToken: true,
        },
        {
            params: {
                key:environment.firebaseAPIKey
            }
        })
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken,+resData.expiresIn);
        }))
    }

    autoLogin(){
        const userData: {
            email:string;
            id:string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token,new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
            this.user.next(loadedUser);
        }
    }

    logout(){
        this.user.next(null);
        this.router.navigate(["/login"]);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration:number){
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();
        }, expirationDuration);
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = "An unknown error occurred!";
        if(!errorRes.error || !errorRes.error.error)
            return throwError(errorMessage) ;
        console.log(errorRes.error.error.message);
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = "This email already exists!" ;
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists.'
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'This password is not correct!'
                break;
        }
        return throwError(errorMessage);
    }
}