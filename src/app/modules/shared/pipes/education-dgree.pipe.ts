import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'educationDgree'
})
export class educationDgreePipe implements PipeTransform {

    transform(dgree: number): string {
        let educationDgree = '';
        switch (dgree) {
            case 1:
                educationDgree = 'University'
                break;
            case 2:
                educationDgree = 'Master';
                break;
            case 3:
                educationDgree = 'Doctorate';
                break;
           
        }
        return educationDgree;
    }

}
