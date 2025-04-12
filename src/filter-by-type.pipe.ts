import { Pipe, PipeTransform } from '@angular/core';
import { Donation } from 'src/app/front_end/pages/models/donation'; // Assurez-vous que le modèle Donation est correctement importé

@Pipe({
  name: 'filterByType'
})
export class FilterByTypePipe implements PipeTransform {
  transform(donations: Donation[], type: string): Donation[] {
    if (!donations || !type) {
      return donations; // Retourne la liste complète si aucune donation ou aucun type n'est fourni
    }

    if (type === 'ALL') {
      return donations; // Retourne toutes les donations si le type est 'ALL'
    }

    // Filtre les donations par type
    return donations.filter(donation => donation.typeDon === type);
  }
}