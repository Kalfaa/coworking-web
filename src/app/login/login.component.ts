import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {AlertService} from '../helpers/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;
  constructor(    private fb: FormBuilder,
                  private authService: AuthService,
                  private router: Router,
                  private alertService: AlertService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void  {

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    console.log(this.authService);
    this.authService.login(this.form.controls.username.value, this.form.controls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
              this.alertService.error(error);
              this.loginInvalid = true;
              console.log(error);
              console.log('eheheh');
        });
  }

}
