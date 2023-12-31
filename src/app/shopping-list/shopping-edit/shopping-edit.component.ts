import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,

} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('form',{static:false}) slForm: NgForm;
  subscription: Subscription;
  editMode =false;
  editedItemIndex:number;
  editedItem: Ingredient;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index:number) =>{
    this.editMode = true;
    this.editedItemIndex = index;
    this.editedItem = this.shoppingListService.getIngredient(index);
    this.slForm.setValue({
      name: this.editedItem.name,
      amount: this.editedItem.amount,
    })
    });
  }

  onSubmit(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
  
    if(this.editMode){
     this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient) ;
    }
    else{
      this.shoppingListService.addIngredient(newIngredient);
    }
    form.reset();
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

}
