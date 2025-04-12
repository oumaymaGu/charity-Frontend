import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCard'
})
export class MaskCardPipe implements PipeTransform {
  transform(cardNumber: string): string {
    if (!cardNumber) return '';

    // Supprime tous les espaces et caractères non numériques
    const cleanNumber = cardNumber.replace(/\D/g, '');

    // Garde les 4 derniers chiffres et masque le reste avec '*'
    const lastFour = cleanNumber.slice(-4);
    const maskedPart = '*'.repeat(cleanNumber.length - 4);

    // Formate le résultat en groupes de 4 chiffres (avec des espaces)
    return `${maskedPart} ${lastFour}`.trim();
  }
}