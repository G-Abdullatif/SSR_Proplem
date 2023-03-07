import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus'
})
export class AppointmentStatusPipe implements PipeTransform {

  transform(status: number): string {
    let appointmentStatus = '';
    switch (status) {
      case 1:
        appointmentStatus = 'New'
        break;
      case 2:
        appointmentStatus = 'WaitApply';
        break;
      case 3:
        appointmentStatus = 'WaitPayment';
        break;
      case 4:
        appointmentStatus = 'Confirmed';
        break;
      case 5:
        appointmentStatus = 'Canceled';
        break;
      case 6:
        appointmentStatus = 'Rejected';
        break;
      case 7:
        appointmentStatus = 'WaitStart';
        break;
      case 8:
        appointmentStatus = 'TriedtoCallPatient';
        break;
      case 9:
        appointmentStatus = 'Started';
        break;
      case 10:
        appointmentStatus = 'Ended';
        break;
      case 11:
        appointmentStatus = 'Completed';
        break;
    }
    return appointmentStatus;
  }

}
