import {  Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService{
    recipesChanges = new Subject<Recipe[]>();
    // recipes: Recipe[] = [
    //     new Recipe('Oatmeal', 'This is a healthy oatmeal breakfast', 'https://www.thespruceeats.com/thmb/ILMxUzmY80yFM0NfhclNJ16pcnE=/2122x1415/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-184952222-58a4ba005f9b58a3c91edb5c.jpg', [
    //         new Ingredient('Oats', 1),
    //         new Ingredient('Honey', 2),
    //     ]),
    //     new Recipe('Burger', 'This is an American Fastfood', 'https://www.modernhoney.com/wp-content/uploads/2017/06/DSC_0657-copy.jpg', [
    //         new Ingredient('Buns', 1),
    //         new Ingredient('Cheese', 1),
    //         new Ingredient('Tomato', 2),
    //     ])
    // ];
    private recipes:Recipe[] = [];
    constructor(private shoppingListService: ShoppingListService){};
    getRecipes(){
        return this.recipes.slice();
    }
    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number){
        return this.recipes.slice()[id];
    }

    addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipesChanges.next(this.recipes.slice());
    }

    updateRecipe(index:number, recipe:Recipe){
        this.recipes[index]=recipe;
        this.recipesChanges.next(this.recipes.slice());
    }

    deleteRecipe(id:number){
        this.recipes.splice(id,1);
        this.recipesChanges.next(this.recipes);
    }

    setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanges.next(this.recipes.slice());
    }
}