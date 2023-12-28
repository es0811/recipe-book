import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Route, Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error:string = null;
    errorSubscription: Subscription;
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){};
    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }
    

    onSubmit(form: NgForm){
        let authObservable:Observable<AuthResponseData>;
        const email = form.value.email;
        const password = form.value.password;
        this.isLoading = true;
        if(this.isLoginMode){
            authObservable = this.authService.login(email, password);
        }
        else{
            authObservable = this.authService.signup(email, password);
        }
        authObservable.subscribe((response)=>{
            console.log(response);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            this.showErrorAlert(errorMessage);
            this.error = errorMessage;
            this.isLoading = false;
        });
        form.reset();
    }

    onHandleError(){
        this.error = null;
    }

    private showErrorAlert(alertMessage:string){
        const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContRef = this.alertHost.viewContainerRef;
        hostViewContRef.clear();
        const componentRef = hostViewContRef.createComponent(alertCompFactory);
        componentRef.instance.message = alertMessage;
        this.errorSubscription = componentRef.instance.close.subscribe(() => {
            hostViewContRef.clear();
            this.errorSubscription.unsubscribe();
        });
    }

    ngOnDestroy(): void {
        if(this.errorSubscription)
            this.errorSubscription.unsubscribe();
    }
}