import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Language } from '../../shared/models/language';
import { MyResponseSingle } from '../../shared/models/response';
import { LocalizationResources, Translation} from '../models/localization-resources';
import { LocalizationResourcesService } from '../services/localization-resources.service';


@Component({
  selector: 'app-create-update-modal',
  templateUrl: './create-update-modal.component.html',
  styleUrls: ['./create-update-modal.component.scss']
})
export class CreateUpdateModalComponent implements OnInit, OnDestroy{
  languages: Language[] = [new Language()];
  localizationResource: LocalizationResources = new LocalizationResources(this.languages);
  formGroup: UntypedFormGroup;
  @Input() id: number;
  isLoading$;
  formSubmitAttempt = false;
  private subscriptions: Subscription[] = [];
  environment = environment;
  constructor(
    private fb: UntypedFormBuilder,
    public modal: NgbActiveModal,
    public localizationResourcesService: LocalizationResourcesService) { }
    createlangLocalizationResource(translations: Translation[]): UntypedFormGroup[] {
        const languageWordTranslations = [];
        this.languages.forEach((lang, i) => {
            const item = this.fb.group({
                id: 0,
                languageWordId: 0,
                languageId: lang.id,
                value: [translations[i]?.value, Validators.required],
                isActive: true,
                isDeleted: true,
                operatorId: 0,
                userOperationType: 1
            });
            languageWordTranslations.push(item);
        });
        for (let i = 0; i < translations.length; i++) {
            if (!this.languages.map(({ id }) => id).includes(translations[i].languageId)) {
                const item = this.fb.group({
                    id: 0,
                    languageWordId: 0,
                    languageId: translations[i].languageId,
                    value: [translations[i]?.value, Validators.required],
                    isActive: true,
                    isDeleted: true,
                    operatorId: 0,
                    userOperationType: 1
                });
                languageWordTranslations.push(item)
            }
        }
    return languageWordTranslations;
  }
  ngOnInit(): void {
    this.isLoading$ = this.localizationResourcesService.isLoading$;
    this.languages = JSON.parse(localStorage.getItem('systemLanguages'));
    this.loadLocalizationResource();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      id: this.localizationResource.id,
      key: this.localizationResource.key,
      isActive: this.localizationResource.isActive,
      isDeleted: this.localizationResource.isDeleted,
      operatorId: this.localizationResource.operatorId,
      userOperationType: this.localizationResource.userOperationType,
      languageWordTranslation: this.fb.array(this.createlangLocalizationResource(this.localizationResource.languageWordTranslation))
    });
  }

  loadLocalizationResource() {
    if (!this.id) {
      this.formGroup = this.fb.group({
        id: 0,
        key: null,
        sort: 0,
        isActive: true,
        isDeleted: false,
        operatorId: 0,
        userOperationType: 1,
        languageWordTranslation: this.fb.array(this.createlangLocalizationResource([new Translation(this.languages[0])]))
      });
      this.localizationResource = new LocalizationResources(this.languages);
    } else {
      const sb = this.localizationResourcesService.getLocalizationResourceById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(new LocalizationResources(this.languages));
        })
      ).subscribe((localizationResource: MyResponseSingle) => {
        this.localizationResource = localizationResource.data;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  private prepareLocalizationResource() {
    const formData: LocalizationResources = this.formGroup.value;
    this.localizationResource.languageWordTranslation = formData.languageWordTranslation;
    this.localizationResource.id = formData.id;
    this.localizationResource.key = formData.key;
    this.localizationResource.isActive = formData.isActive;
    this.localizationResource.isDeleted = formData.isDeleted;
    this.localizationResource.operatorId = formData.operatorId;
    this.localizationResource.userOperationType = formData.userOperationType;
  }

  createOrUpdate(localizationResource: LocalizationResources) {
    const sbCreate = this.localizationResourcesService.createOrUpdateLocalizationResource(localizationResource).pipe(
      tap((res) => {
        this.modal.close(res.data);
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.localizationResource);
      }),
    ).subscribe((res: LocalizationResources) => {
      this.localizationResource = res;
    });
    this.subscriptions.push(sbCreate);
  }

  save() {
    this.formSubmitAttempt = true;
    if (this.formGroup.valid) {
      this.prepareLocalizationResource();
      if (this.id) {
        this.formGroup.value.id = this.localizationResource.id;
        this.createOrUpdate(this.localizationResource);
      } else {
        this.createOrUpdate(this.localizationResource);
      }
    }
  }

  isControlValid(controlName, index?: number): boolean{
    if (index !== undefined) {
      return this.formGroup.controls[controlName]['controls'][index].valid;
    } else {
      return this.formGroup.controls[controlName].valid;
    }
  }

  isControlInvalid(controlName, index?: number): boolean{
    if (index !== undefined) {
      return this.formGroup.controls[controlName]['controls'][index].invalid;
    } else {
      return this.formGroup.controls[controlName].invalid;
    }
  }

  isControlTouched(controlName, index?: number): boolean{
    if (index !== undefined) {
      return this.formGroup.controls[controlName]['controls'][index].touched;
    } else {
      return this.formGroup.controls[controlName].touched;
    }
  }

  isControlUnTouched(controlName, index?: number): boolean{
    if (index !== undefined) {
      return this.formGroup.controls[controlName]['controls'][index].untouched;
    } else {
      return this.formGroup.controls[controlName].untouched;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
