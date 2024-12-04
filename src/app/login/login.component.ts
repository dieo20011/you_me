import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzInputModule, NzButtonModule, FormsModule, NzFormModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  emailFocused = false;
  passwordFocused = false;

  constructor(private readonly fb: FormBuilder, private readonly msg: NzMessageService, private readonly _authSvc: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    const data = {
      userName: this.loginForm.get('email')?.value,
      passWord: this.loginForm.get('password')?.value,
    }
    this._authSvc.login(data).subscribe({
      next: (resp: any) => {
        if(resp.status) {
          this._authSvc.setToken(resp.data.token);
          this.router.navigateByUrl('/dashboard');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.msg.error('Login failed');
      }
    });
    
  } 

  onFocusEmail(): void {
    this.emailFocused = true;
  }

  onBlurEmail(): void {
    this.emailFocused = false;
  }

  onFocusPassword(): void {
    this.passwordFocused = true;
  }

  onBlurPassword(): void {
    this.passwordFocused = false;
  }
}
