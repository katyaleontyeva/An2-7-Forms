import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from './../../models/user';

import { CustomValidators } from './../../validators';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit {
  countries: Array<string> = ['Ukraine', 'Armenia', 'Belarus', 'Hungary', 'Kazakhstan', 'Poland', 'Russia'];
  user: User = new User();
  userForm: FormGroup;
  placeholder = {
    email: 'Email (required)',
    phone: 'Phone'
  };


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    // this.createForm();

  }

  onSetNotification(notifyVia: string) {
    const phoneControl = this.userForm.get('phone');
    const emailControl = this.userForm.get('email');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
      this.placeholder.email = 'Email';
      this.placeholder.phone = 'Phone (required)';
    } else {
      emailControl.setValidators( [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
        Validators.email
      ]);
      phoneControl.clearValidators();
      this.placeholder.email = 'Email (required)';
      this.placeholder.phone = 'Phone';
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }


  private createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }),
      lastName: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      notification: new FormControl('email'),
      serviceLevel: new FormControl('', {
        validators: [CustomValidators.serviceLevel],
        updateOn: 'blur'
      }),
      sendProducts: new FormControl(true)
    });
  }

  private buildForm() {
    this.userForm = this.fb.group({
      // firstName: ['', [Validators.required, Validators.minLength(3)]],
      // It works!
      // firstName: new FormControl('', {
      //   validators: [Validators.required, Validators.minLength(3)],
      //   updateOn: 'blur'
      // }),
      // It works since v7
      firstName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }),

      lastName: [
        { value: 'Leonteva', disabled: false },
        [Validators.required, Validators.maxLength(50)]
      ],
      email: [
        '',
        [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'), Validators.email]
      ],
      sendProducts: true,
      phone: '',
      notification: 'email',
      // serviceLevel: ['', CustomValidators.serviceLevel],
      // serviceLevel: ['', CustomValidators.serviceLevelRange(1, 3)],
      serviceLevel: [''], // вместо этого используется директива
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
