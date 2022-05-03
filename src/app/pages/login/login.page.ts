import { CustomValidationService } from './../../services/custom-validation.service';
import { Register } from './../../interfaces/register.interface';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AppFacade } from '../../+state/app.facade';
import { Credentials } from '../../interfaces/credentials.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit {

  //Login Form´
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  //Register Form
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    role: new FormControl('', [
      Validators.required
    ]),
  }, {
    validators: this.customValidator.passwordMatchValidator('password', 'passwordConfirm')
  });

  constructor(
    private appFacade: AppFacade,
    private modalController: ModalController,
    private customValidator: CustomValidationService,
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //Logout (clear store)
    this.appFacade.clearStore();
  }

  login() {
    const user: Credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.appFacade.login(user);
  }

  register() {
    const user: Register = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };
    this.appFacade.register(user);
    this.closeModal();
  }

  closeModal() {
    this.modalController.dismiss({dismissed: true});
  }

}
