import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidControlScrollDirective } from '../../directive/invalid-control-scroll.directive';
import { DefaultImageDirective } from '../../directive/default-image.directive';
import { UserTypePipe } from '../../pipes/user-type.pipe';
import { AppointmentStatusPipe } from '../../pipes/appointment-status.pipe';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { PrivacyPolicyComponent } from '../../components/privacy-policy/privacy-policy.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { StarRatingComponent } from "../../../shared/components/star-rating/star-rating.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChangeEmailComponent } from '../../components/change-email/change-email.component';
import { CodeInputModule } from 'angular-code-input';
import { ChangePhoneComponent } from '../../components/change-phone/change-phone.component';
import { NotificationSettingsComponent } from '../../components/notification-settings/notification-settings.component';
import { LangFilterPipe } from '../../pipes/lang-filter.pipe';
import { LangCodePipe } from '../../pipes/lang-code.pipe';
import { DragAndDropDirective } from '../../directive/drag-and-drop.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RemoveLeadingZeroDirective } from '../../directive/remove-leading-zero.directive';
import { blogStatusPipe } from '../../pipes/blog-status.pipe';
import { educationDgreePipe } from '../../pipes/education-dgree.pipe';
import { MapComponent } from '../../components/map/map.component';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AlertComponent } from '../../components/alert/alert.component';

@NgModule({
    declarations: [
        InvalidControlScrollDirective,
        DefaultImageDirective,
        DragAndDropDirective,
        RemoveLeadingZeroDirective,
        NoDataComponent,
        PrivacyPolicyComponent,
        NotificationComponent,
        UserTypePipe,
        LangFilterPipe,
        LangCodePipe,
        StarRatingComponent,
        AppointmentStatusPipe,
        blogStatusPipe,
        educationDgreePipe,
        ChangeEmailComponent,
        ChangePhoneComponent,
        NotificationSettingsComponent,
        MapComponent,
        PageTitleComponent,
        AlertComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        MatDialogModule,
        TranslationModule,
        CRUDTableModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        CodeInputModule,
        MatProgressBarModule,
        NgxPermissionsModule.forChild(),
        RouterModule

    ],
    exports: [
        InvalidControlScrollDirective,
        DefaultImageDirective,
        DragAndDropDirective,
        RemoveLeadingZeroDirective,
        NoDataComponent,
        PrivacyPolicyComponent,
        NotificationComponent,
        UserTypePipe,
        LangFilterPipe,
        LangCodePipe,
        StarRatingComponent,
        MatButtonToggleModule,
        MatProgressBarModule,
        CodeInputModule,
        AppointmentStatusPipe,
        blogStatusPipe,
        educationDgreePipe,
        ChangeEmailComponent,
        ChangePhoneComponent,
        NotificationSettingsComponent,
        MapComponent,
        PageTitleComponent,
        AlertComponent
    ]
})
export class SharedModule { }
