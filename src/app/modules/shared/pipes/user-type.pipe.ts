import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: number): string {
    let user = '';
    switch (value) {
      case 1:
        user = 'Admin'
        break;
      case 2:
        user = 'Normal'
        break;
    }
    return user;
  }

}
