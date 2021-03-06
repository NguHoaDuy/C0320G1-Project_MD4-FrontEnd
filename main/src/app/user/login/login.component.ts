import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginInfo } from '../../auth/login-info';
import { AuthJwtService } from '../../auth/auth-jwt.service';
import { TokenStorageService } from '../../auth/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";

declare let $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  userInfo: AuthLoginInfo;
  message = '';
  isRemember: boolean;
  showPassword = false;

  constructor(
    private authService: SocialAuthService,
    private auth: AuthJwtService,
    private fb: FormBuilder,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, validateWhitespace,
      Validators.pattern('^[a-z][a-z0-9_\\.]{2,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$')]],
      password: ['', [Validators.required]],
    });

    $('#togglePassword').click(() => {
      // tslint:disable-next-line:prefer-const
      let passwordFieldType = $('#password').attr('type');
      // tslint:disable-next-line:triple-equals
      if (passwordFieldType == 'password') {
        $('#password').prop('type', 'text');
        this.showPassword = true;
      } else {
        $('#password').prop('type', 'password');
        this.showPassword = false;
      }
    });
  }

  signInWithFB() {
    console.log(FacebookLoginProvider.PROVIDER_ID);
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      console.log(res);
    });
  };

  onSubmit() {
    this.submitted = true;
    this.userInfo = new AuthLoginInfo(this.femail.value, this.fpassword.value);
    this.login(this.userInfo);
  }

  get femail() {
    return this.loginForm.get('email');
  }

  get fpassword() {
    return this.loginForm.get('password');
  }

  remember($event) {
    this.isRemember = $event.target.checked;
  }

  public login(userInfo) {
    this.auth.attemptAuth(userInfo).subscribe(
      data => {
        this.tokenStorage.saveJwtResponse(data, this.isRemember);
      },
      error => {
        console.log('Error ', error);
        this.message = 'Tài Khoản này không đúng hoặc đã bị khóa';
      }, () => {
        this.activatedRoute.queryParamMap.subscribe(value => {
          const returnUrl = value.get('returnUrl');
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        });
      }
    );
  }

}

function validateWhitespace(c: AbstractControl) {
  if (c.value !== '') {
    const isWhitespace = c.value.trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  return null;
}
