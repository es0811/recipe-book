import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";

const routes = [
    {path: '', component: AuthComponent },
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule,]
})
export class AuthRoutingModule{

}