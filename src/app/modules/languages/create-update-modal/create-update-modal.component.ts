import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MyResponseSingle } from '../../shared/models/response';
import { Language } from "../models/languages";
import { LanguagesService } from "../services/languages.service";
const USERDATA_DATA = `${environment.appVersion}-${environment.USERDATA_KEY}`;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-update-modal',
  templateUrl: './create-update-modal.component.html',
  styleUrls: ['./create-update-modal.component.scss']
})
export class CreateUpdateModalComponent implements OnInit, OnDestroy{
  @ViewChild('imageFile', {static: false}) imageFile: ElementRef;
  imageSrc: SafeResourceUrl = '';
  defaultImage = environment.apiUrl+'img/default.jpg';
  language: Language = new Language(JSON.parse(localStorage.getItem(USERDATA_DATA)).id);
  formGroup: UntypedFormGroup;
  @Input() id: number;
  isLoading$;
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private languageService: LanguagesService) { }
  ngOnInit(): void {
    this.isLoading$ = this.languageService.isLoading$;
    this.loadCountry();
  }

  onFileChange(files) {
    const reader = new FileReader();

    if (files && files.length) {
      const [file] = files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
          this.imageFile.nativeElement.style = "display: block";
          this.formGroup.patchValue({
            imageFile: reader.result,
            flag: file.name
          });
        // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
      };
    }
  }

  loadForm() {
    if (!this.id) {
      this.formGroup = this.fb.group({
        id: 0,
        name: [null, Validators.required],
        imageFile: [null, Validators.required],
        flag: [null, Validators.required],
        sort: [0, Validators.required],
        code: [null, Validators.required],
        isRTL: false,
        isActive: true,
        isDeleted: false,
        operatorId: 0,
        userOperationType: 1,
      });
      this.language = new Language(JSON.parse(localStorage.getItem(USERDATA_DATA)).id);
    } else {
      this.formGroup = this.fb.group({
        id: this.language.id,
        name:  [this.language.name, Validators.required],
        imageFile: [this.language.imageFile],
        flag: [this.language.flag, Validators.required],
        sort:  [this.language.sort, Validators.required],
        code:  [this.language.code, Validators.required],
        isRTL: this.language.isRTL,
        isActive: this.language.isActive,
        isDeleted: this.language.isDeleted,
        operatorId: this.language.operatorId,
        userOperationType: this.language.userOperationType,
      });
      this.imageSrc = environment.apiUrl + 'img/Language/natural/' + this.language.flag;
    }
  }

  loadCountry() {
    if (!this.id) {
      this.loadForm();
    } else {
      const sb = this.languageService.getLanguageById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(new Language(JSON.parse(localStorage.getItem(USERDATA_DATA)).id));
        })
      ).subscribe((country: MyResponseSingle) => {
        this.language = country.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  private prepareCountry() {
    const formData: Language = this.formGroup.value;
    this.language.id = formData.id;
    this.language.name = formData.name;
    this.language.imageFile = formData.imageFile;
    this.language.flag = formData.flag;
    this.language.sort = formData.sort;
    this.language.code = formData.code;
    this.language.isRTL = formData.isRTL;
    this.language.isActive = formData.isActive;
    this.language.isDeleted = formData.isDeleted;
    this.language.operatorId = formData.operatorId;
    this.language.userOperationType = formData.userOperationType;
  }

  createOrUpdate(country: Language) {
    const sbCreate = this.languageService.createOrUpdateLanguage(country).pipe(
      tap((res) => {
        this.modal.close(res.data);
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.language);
      }),
    ).subscribe((res: Language) => {
      this.language = res;
    });
    this.subscriptions.push(sbCreate);
  }

    save() {
    if (this.formGroup.valid) {
      this.prepareCountry();
      if (this.id) {
        this.formGroup.value.id = this.language.id;
        this.createOrUpdate(this.language);
      } else {
        this.createOrUpdate(this.language);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
