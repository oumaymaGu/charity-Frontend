import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  submitClaim(event: Event): void {
    event.preventDefault();
    const confirmationMessage = document.querySelector('.confirmation-message') as HTMLElement;
    if (confirmationMessage) {
      confirmationMessage.style.display = 'block';
    }
  }
}