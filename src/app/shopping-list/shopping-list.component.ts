import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private isChanged: Subscription;
  constructor(private shoppingListService: ShoppingListService, private loggingService: LoggingService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.isChanged = this.shoppingListService.ingredientsChanges.subscribe((ingredients : Ingredient[]) =>{
      this.ingredients = ingredients;
      this.loggingService.printLog("Hello from shopping list component!");
    })
  }

  ngOnDestroy(): void {
    this.isChanged.unsubscribe();
  }

  onEditItems(index:number){
    this.shoppingListService.startedEditing.next(index);
  }
}
