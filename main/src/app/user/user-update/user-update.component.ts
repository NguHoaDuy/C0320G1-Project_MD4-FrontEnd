//creator: Nguyễn Xuân Hùng
import { Router } from '@angular/router';
import { UserUpdateDto } from '../../shared/models/dtos/UserUpdateDto';

import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup,AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { TokenStorageService } from 'src/app/auth/token-storage.service';

function validateWhitespace(c:AbstractControl) {
  if(c.value!=''){
    const isWhitespace = c.value.trim().length===0;
    if(isWhitespace){
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }
}
function validateSpecialCharacters(c:AbstractControl) {
  const pattern = /[$&+,:;=?@#|'<>.^*()%!-]+/;
    return (c.value.match(pattern)) ? {
      containSpecialCharacters : true
    } :null
}

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})

export class UserUpdateComponent implements OnInit,AfterViewInit {
  @ViewChild('focusCheck',{static: true}) private elementRef: ElementRef;
  userForm: FormGroup;
  hideableDiv= false;
  user: UserUpdateDto = {
    id: null,
    fullName: null,
    email: null,
    birthday: null,
    password: null,
    newPassword: null,
    confirmPassword: null,
    idCard: null,
    gender:null,
    phoneNumber: null,
    address: null,
    backendMessage: null
  };

  backendMessages: string[];
  message="";
  errorMessage="";
  dateOfBirth:string;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router : Router,
              private tokenStorageService: TokenStorageService
            ) {}
  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
  ngOnInit() {
    this.ngAfterViewInit();
    this.userForm = this.fb.group({
      fullName: ['',[Validators.required,validateWhitespace,validateSpecialCharacters,Validators.maxLength(255)]],
      email: ['',[Validators.required,Validators.pattern(/^[a-z][a-z0-9_\.]{2,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,}){1,2}$/)]],
      birthday: ['',[Validators.required,Validators.pattern(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),this.userService.validateBirthday]],
      pwGroup: this.fb.group({
        password: ['',[validateWhitespace]],
        newPassword: ['',[Validators.minLength(6),Validators.maxLength(20),validateWhitespace]],
        confirmPassword: ['',[Validators.minLength(6),Validators.maxLength(20),validateWhitespace]]
      }, {validators: [this.userService.comparePassword]}),
      idCard: ['',[Validators.required,Validators.pattern(/^[0-9]+$/),Validators.minLength(6),Validators.maxLength(20)]],
      phoneNumber: ['',[Validators.required,Validators.pattern(/^[0-9]+$/),Validators.maxLength(20)]],
      gender:['',[Validators.required]],
      address: ['',[Validators.required,Validators.maxLength(255)]]
    });
    this.user.id= this.tokenStorageService.getJwtResponse().userId;
      this.userService.getUserById(this.user.id).subscribe(data=>{

        this.userForm.patchValue(data);
      },error=>{this.errorMessage="Lỗi!! Không tìm thấy tài khoản của bạn"})
  }
  updateUser(){
    this.errorMessage="";
    this.message="";
    this.user = this.userForm.value;
    this.user.password = this.userForm.get('pwGroup').get('password').value;
    this.user.newPassword = this.userForm.get('pwGroup').get('newPassword').value;
    this.user.confirmPassword = this.userForm.get('pwGroup').get('confirmPassword').value;
    this.user.id= this.tokenStorageService.getJwtResponse().userId;
    this.userService.updateUser(this.user,this.tokenStorageService.getJwtResponse().userId).subscribe(data=>{
        this.backendMessages = data.backendMessage;
    },error=>{this.errorMessage="Cập nhật tài khoản thất bại"},()=>{
      if(this.backendMessages.length==0){
        this.message="Thông tin tài khoản của bạn đã được cập nhật";
      }
      this.ngOnInit();
    })
  }

  backToHomePage(){
    this.router.navigateByUrl("/home");
  }
  togglePass(){
    if(this.hideableDiv==true){
      this.hideableDiv=false;
    }else{
      this.hideableDiv = true;
    }
  }
  getValueDateOfBirth(value: string): void {
    this.dateOfBirth = value;
  }

  printDate(): void {
    console.log(this.dateOfBirth);
  }

}
