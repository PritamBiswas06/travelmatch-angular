import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/loader.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {

  email = localStorage.getItem("verifyEmail");

  otpValue = "";

  digits = new Array(6);

  @ViewChild("otpInput") otpInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService
  ) {}

  focusInput() {
    this.otpInput.nativeElement.focus();
  }

  resendTimer = 30;
canResend = false;

ngOnInit(){
  this.startTimer();
}

  onOtpChange() {

    // allow numbers only
    this.otpValue = this.otpValue.replace(/\D/g,'');

    // max length
    if(this.otpValue.length > 6){
      this.otpValue = this.otpValue.substring(0,6);
    }

    // ⭐ AUTO VERIFY WHEN 6 DIGITS ENTERED
    if(this.otpValue.length === 6){
      this.verify();
    }

  }

  onPaste(event: ClipboardEvent){

    const pasted = event.clipboardData?.getData('text') || '';

    if(/^\d{6}$/.test(pasted)){
      this.otpValue = pasted;

      // auto verify
      setTimeout(()=>{
        this.verify();
      },200);
    }

  }
  startTimer(){

  this.resendTimer = 30;
  this.canResend = false;

  const interval = setInterval(()=>{

    this.resendTimer--;

    if(this.resendTimer === 0){
      this.canResend = true;
      clearInterval(interval);
    }

  },1000);

}

resendOtp(){

  if(!this.canResend) return;

  this.loader.show("Sending new OTP...");

  this.authService.resendOtp(this.email!).subscribe({

    next: ()=>{

      this.loader.hide();

      alert("New OTP sent to your email");

      this.startTimer();

    },

    error: ()=>{

      this.loader.hide();

      alert("Failed to resend OTP");

    }

  });

}

  verify(){

    if(this.otpValue.length !== 6){
      return;
    }

    this.loader.show("Verifying your email...");

    this.authService.verifyEmail(this.email!, this.otpValue).subscribe({

      next: () => {

        this.loader.hide();

        alert("Email verified successfully");

        localStorage.removeItem("verifyEmail");

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.loader.hide();

        alert(err.error?.message || "Verification failed");

      }

    });

  }

}