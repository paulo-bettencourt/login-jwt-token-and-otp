import {AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit{

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  isLinear = true;
  username: string = this.firstFormGroup.controls['firstCtrl'].value  as string;
  password: string = this.secondFormGroup.controls['secondCtrl'].value  as string;
  isLogged = false;
  token!: string;
  otp!: string;
  nextButtonIfOTPConfirmed!: any;
  otpValue!: any;

  constructor(private _formBuilder: FormBuilder, private _service: ApiService) {}

  ngAfterViewInit(): void {
    const button = document.getElementById('nextButtonOTP') as HTMLElement;
    button.style.display = "none";
    }

  getOTP() {
    this.username = this.firstFormGroup.controls['firstCtrl'].value  as string;
    this.password = this.secondFormGroup.controls['secondCtrl'].value  as string;
    this._service.getOTP({username: this.username, password: this.password}).subscribe({
      next: (OTP: any) => {
        this.otp = OTP.OTP;
      },
      error: (err) => console.log(err)
    })
  }

  confirmOTP() {
    this._service.confirmOTP({otp: this.otpValue}).subscribe({
      next: (data: any) => {
        this.token = data.token;
        localStorage.setItem('token', data.token)
        this.nextButtonIfOTPConfirmed = document.getElementById('nextButtonOTP') as HTMLElement;
        this.nextButtonIfOTPConfirmed.click();
        this.isLogged = true;
        this.token = data.token;
      },
      error: (err) => {
        console.log(err),
          this.nextButtonIfOTPConfirmed = document.getElementById('nextButtonOTP') as HTMLElement;
        this.nextButtonIfOTPConfirmed.click();
          this.isLogged = false;
      }
    })
  }

  resetData() {
    localStorage.removeItem('token');
  }
}
