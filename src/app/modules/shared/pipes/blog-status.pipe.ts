import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'blogStatus'
})
export class blogStatusPipe implements PipeTransform {

    transform(status: number): string {
        let blogStatus = '';
        switch (status) {
            case 1:
                blogStatus = 'Pending'
                break;
            case 2:
                blogStatus = 'Approved';
                break;
            case 3:
                blogStatus = 'Rejected';
                break;
            case 4:
                blogStatus = 'invisible';
                break;
        }
        return blogStatus;
    }

}
