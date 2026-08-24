import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/loader.service';

@Component({
  selector: 'app-verify-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-reset.component.html',
  styleUrls: ['./verify-reset.component.css']
})
export class VerifyResetComponent implements OnInit {

  @ViewChild('otpInput') otpInput!: ElementRef;

  otpValue = '';

  resendTimer = 30;
  canResend = false;

  email = localStorage.getItem("resetEmail");

  constructor(
    private auth: AuthService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit(){
    this.startTimer();
  }

  focusInput(){
    this.otpInput.nativeElement.focus();
  }

  onOtpChange(){

    // allow digits only
    this.otpValue = this.otpValue.replace(/\D/g,'');

    if(this.otpValue.length === 6){
      this.verify();
    }

  }

  onPaste(event: ClipboardEvent){

    const pasted = event.clipboardData?.getData('text') || '';

    if(/^\d{6}$/.test(pasted)){
      this.otpValue = pasted;
      this.verify();
    }

  }

  startTimer(){

    const interval = setInterval(()=>{

      if(this.resendTimer > 0){
        this.resendTimer--;
      }
      else{
        this.canResend = true;
        clearInterval(interval);
      }

    },1000);

  }

  resendOtp(){

    this.resendTimer = 30;
    this.canResend = false;

    this.startTimer();

    alert("OTP resent");

  }

  verify(){

    if(this.otpValue.length !== 6){
      alert("Enter the 6 digit code");
      return;
    }

    this.loader.show("Verifying code...");

    this.auth.verifyReset(this.email!, this.otpValue).subscribe({

      next: () => {

        this.loader.hide();

        this.router.navigate(['/reset-password']);

      },

      error: (err) => {

        this.loader.hide();

        alert(err.error?.message || "Invalid code");

      }

    });

  }

}