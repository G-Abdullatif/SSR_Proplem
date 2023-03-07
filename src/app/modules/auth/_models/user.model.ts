import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  accountId: number;
  healthFacilityId: number;
  email: string;
  emailActivationCode: string;
  firebaseMobileToken: string;
  firebaseWebToken: string;
  firstName: string;
  lastName: string;
  fullName: string;
  id: number;
  image: string;
  isActive: boolean;
  isDeleted: boolean;
  jwtToken: string;
  lastActivatedDate: string;
  lastGeneratedEmailCodeTime: string;
  lastGeneratedPhoneCodeTime: string;
  password: string;
  phoneActivationCode: string;
  phoneNumber: string;
  resetPasswordCode: string;
  sendResetPasswordCodeDateTime: string;
  userType: number;
  defaultLanguageId: number;
  iosDeviceID: number;
  isActiveEmail: boolean;
  isActivePhone: boolean;
  isAllowNotificationByEmail: boolean;
  isAllowNotificationByMobile: boolean;
  isAllowNotificationBySMS: boolean;
  isAllowNotificationByWeb: boolean;
  mobileToken: string;
  webToken: string;
  registerStep: number;
}

export interface NotificationSettings{
  isAllowNotificationByEmail: boolean;
  isAllowNotificationBySMS: boolean;
  isAllowNotificationByMobile: boolean;
  isAllowNotificationByWeb: boolean;
}

