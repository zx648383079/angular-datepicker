import { AngularDatepickerOptions } from "datepicker-options";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { DatepickerComponent } from "datepicker.component";

@NgModule({
    imports: [
    ],
    declarations: [
        DatepickerComponent,
    ],
    providers: [],
    exports: [
        DatepickerComponent,
    ]
})
export class AngularDatepickerModule {
    static forRoot(config: AngularDatepickerOptions): ModuleWithProviders {
        return {
            ngModule: AngularDatepickerModule,
            providers: [
                { provide: AngularDatepickerOptions, useValue: config }
            ]
        };
    }
}