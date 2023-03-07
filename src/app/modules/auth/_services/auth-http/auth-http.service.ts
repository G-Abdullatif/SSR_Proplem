import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../index';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { MyResponseSingle } from 'src/app/modules/shared/models/response';
import { NotificationSettings } from '../../_models/user.model';

const API_USERS_URL = `${environment.apiUrl}User/`;

@Injectable({
    providedIn: 'root',
})
export class AuthHTTPService {
    constructor(private http: HttpClient) { }

    // public methods
    login(emailOrPhoneNumber: string, password: string, loginBy: number, isRememberMe: boolean): Observable<any> {
        return this.http.post<AuthModel>(API_USERS_URL + 'SignIn',
            { emailOrPhoneNumber, password, loginBy, isRememberMe }, { headers: { skip: "true" } });
    }
    // CREATE =>  POST: add a new user to the server
    createAccount(user: UserModel): Observable<any> {
        return this.http.post<UserModel>(`${API_USERS_URL}Register`, user);
    }
    // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
    forgotPassword(emailOrPhoneNumber: string, resetBy: number): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(`${API_USERS_URL}ForgotPassword?emailOrPhoneNumber=${emailOrPhoneNumber.replace("+","%2B")}&resetBy=${resetBy}`);
    }

    verifyResetCode(code: string): Observable<MyResponseSingle> {
        return this.http.get<MyResponseSingle>(`${API_USERS_URL}verifyResetCode?resetCode=${code}`);
    }

    confirmChangeEmail(email: string, emailActivationCode: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ConfirmChangeEmail`, { email, emailActivationCode });
    }

    confirmChangePhoneNumber(phoneCountryCode: string, phoneNumber: string, phoneActivationCode: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ConfirmChangePhoneNumber`, { phoneCountryCode, phoneNumber, phoneActivationCode });
    }

    resetPasswordByCode(resetPasswordCode: string, password: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ResetPasswordByCode`, { resetPasswordCode, password });
    }

    changePassword(currentPassowrd: string, newPassowrd: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ChangePassword`, { currentPassowrd, newPassowrd });
    }

    changeEmail(email: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ChangeEmail`, { email });
    }

    changeNotificationSetting(notificationSettings: NotificationSettings): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ChangeNotificationSetting`, notificationSettings);
    }

    changePhoneNumber(phoneCountryCode: string, phoneNumber: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}ChangePhoneNumber`, { phoneCountryCode, phoneNumber });
    }

    getUserByToken(): Observable<any> {
        return this.http.get<UserModel>(`${API_USERS_URL}GetUserByToken`);
    }

    updateToken(token: string): Observable<MyResponseSingle> {
        return this.http.post<MyResponseSingle>(`${API_USERS_URL}UpdateToken`, { token: token, tokenType: 1 });
    }
}
