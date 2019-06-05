import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceLevelDirective, AsyncEmailValidatorDirective } from '.';

@NgModule({
  declarations: [
    ServiceLevelDirective,
    AsyncEmailValidatorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ServiceLevelDirective,
    AsyncEmailValidatorDirective
  ]
})
export class ValidatorsModule { }
