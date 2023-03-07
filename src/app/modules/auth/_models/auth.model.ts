export class AuthModel {
  jwtToken: string;

  setAuth(auth: any) {
    this.jwtToken = auth.jwtToken;
  }
}
