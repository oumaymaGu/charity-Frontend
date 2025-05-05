// notification-type.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationType',
  standalone: true // Si vous utilisez les standalone components (Angular 14+)
})
export class NotificationTypePipe implements PipeTransform {
  transform(value: string): string {
    const typeMap: Record<string, string> = {
      'DON_MATERIEL': 'Don Matériel',
      'DON_FINANCIER': 'Don Financier',
      'SUCCESS': 'Succès',
      'ERROR': 'Erreur',
      'INFO': 'Information'
    };

    return typeMap[value] || value;
  }
}