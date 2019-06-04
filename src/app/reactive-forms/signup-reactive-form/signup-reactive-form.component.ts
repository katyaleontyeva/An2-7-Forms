import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { User } from './../../models/user';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit {
  countries: Array<string> = ['Ukraine', 'Armenia', 'Belarus', 'Hungary', 'Kazakhstan', 'Poland', 'Russia'];
  user: User = new User();
  userForm: FormGroup;


  constructor() { }

  ngOnInit() {
    this.createForm();
    this.setFormValues();
    // this.patchFormValues();

  }

  private createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendProducts: new FormControl(this.user.sendProducts)
    });
  }

  onSave() {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  // Задать значения для ВСЕХ контролов
  private setFormValues() {
    this.userForm.setValue({
      firstName: 'Ekaterina',
      lastName: 'Leonteva',
      email: 'ekaterina_leonteva@epam.com',
      sendProducts: false
    });
  }

  // Задать значения для множества контролов
  private patchFormValues() {
    this.userForm.patchValue({
      firstName: 'Ekaterina',
      lastName: 'Leonteva'
    });
  }


}
