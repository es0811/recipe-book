import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions:Subscription;
  isAuthenticated:boolean= false;
  constructor(private dataStorageService: DataStorageService, private authService: AuthService){}
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
      this.subscriptions = this.authService.user.subscribe(user =>{
        if(user)
          this.isAuthenticated = true;
        else
          this.isAuthenticated = false;

      });
    }
;
  onSaveData(){
    this.dataStorageService.storeRecipes();
  }
  onFecthData(){
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
    
  }
}
