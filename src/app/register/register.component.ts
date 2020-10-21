import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  form: FormGroup;
  public loginInvalid: boolean;
  constructor(    private fb: FormBuilder,
                  private authService: AuthService,
                  private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required ]
    }, {validator: this.checkPasswords });
  }


  checkPasswords(group: FormGroup): object { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('password2').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit(): void  {

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    console.log('cc');

    this.authService.register(this.form.controls.username.value, this.form.controls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
          console.log('eheheh');
        });
  }

}


