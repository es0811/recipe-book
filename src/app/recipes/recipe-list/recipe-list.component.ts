import { Component, OnDestroy, OnInit, } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  subscription: Subscription;
  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private dataStoreService: DataStorageService) { }

  ngOnInit() {
    this.dataStoreService.fetchRecipes();
    this.recipes = this.recipeService.getRecipes();
    this.subscription  = this.recipeService.recipesChanges.subscribe((recipes:Recipe[])=>{
      this.recipes = recipes;
    })
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
