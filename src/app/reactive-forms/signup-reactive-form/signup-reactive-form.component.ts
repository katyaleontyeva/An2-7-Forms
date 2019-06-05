import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';

import { User } from './../../models/user';

import { CustomValidators } from './../../validators';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit, OnDestroy {
  countries: Array<string> = ['Ukraine', 'Armenia', 'Belarus', 'Hungary', 'Kazakhstan', 'Poland', 'Russia'];
  user: User = new User();
  userForm: FormGroup;
  validationMessage: string;
  placeholder = {
    email: 'Email (required)',
    confirmEmail: 'Confirm Email (required)',
    phone: 'Phone'
  };

  private sub: Subscription;

  private validationMessagesMap = {
    email: {
      required: 'Please enter your email address.',
      pattern: 'Please enter a valid email address.',
      email: 'Please enter a valid email address.',
      asyncEmailInvalid:
        'This email already exists. Please enter other email address.'
    }
  };


  constructor(
    private fb: FormBuilder
  ) { }

  get addresses(): FormArray {
    return <FormArray>this.userForm.get('addresses');
  }

  ngOnInit() {
    this.buildForm();
    // this.createForm();

    this.watchValueChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  // onSetNotification(notifyVia: string) {
  private setNotification(notifyVia: string) {
    const controls = new Map();
    controls.set('phoneControl', this.userForm.get('phone'));
    controls.set('emailGroup', this.userForm.get('emailGroup'));
    controls.set('emailControl', this.userForm.get('emailGroup.email'));
    controls.set(
      'confirmEmailControl',
      this.userForm.get('emailGroup.confirmEmail')
    );

    if (notifyVia === 'text') {
      controls.get('phoneControl').setValidators(Validators.required);
      controls.forEach(
        (control, index) =>
          index !== 'phoneControl' && control.clearValidators()
      );

      this.placeholder = {
        phone: 'Phone (required)',
        email: 'Email',
        confirmEmail: 'Confirm Email'
      };
    } else {
      controls
        .get('emailControl')
        .setValidators([
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
          Validators.email
        ]);
      controls.get('confirmEmailControl').setValidators([Validators.required]);
      controls.get('emailGroup').setValidators([CustomValidators.emailMatcher]);
      controls.get('phoneControl').clearValidators();

      this.placeholder = {
        phone: 'Phone',
        email: 'Email (required)',
        confirmEmail: 'Confirm Email (required)'
      };
    }
    controls.forEach(control => control.updateValueAndValidity());
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
      emailGroup: this.fb.group({
        email: [
          '',
          [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'), Validators.email]
        ],
        confirmEmail: ['', Validators.required],
      }, {validator: CustomValidators.emailMatcher}),

      sendProducts: true,
      addresses: this.fb.array([this.buildAddress()]),
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

  onBlur() {
    const emailControl = this.userForm.get('emailGroup.email');
    this.setValidationMessage(emailControl, 'email');
  }

  onAddAddress(): void {
    this.addresses.push(this.buildAddress());
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

  private watchValueChanges() {
    this.sub = this.userForm.get('notification').valueChanges
      .subscribe(value => this.setNotification(value));

    const emailControl = this.userForm.get('emailGroup.email');
    const sub = emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value =>
        this.setValidationMessage(emailControl, 'email')
      );
    this.sub.add(sub);
  }

  private setValidationMessage(c: AbstractControl, controlName: string) {
    this.validationMessage = '';

    if ((c.touched || c.dirty) && c.errors) {
      this.validationMessage = Object.keys(c.errors)
        .map(key => this.validationMessagesMap[controlName][key])
        .join(' ');
    }
  }

  private buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      country: '',
      city: '',
      zip: '',
      street1: '',
      street2: ''
    });
  }

}
