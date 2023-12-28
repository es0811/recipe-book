import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { LoadinSpinnerComponent } from "./loadingSpinner/loading-spinner.component";
import { PlaceHolderDirective } from "./placeholder/placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        AlertComponent,
        LoadinSpinnerComponent,
        PlaceHolderDirective,
        DropdownDirective,
    ],
    imports:[
        CommonModule,
    ],
    exports:[
        AlertComponent,
        LoadinSpinnerComponent,
        PlaceHolderDirective,
        DropdownDirective,
        CommonModule,
    ]
})
export class SharedModule{

}