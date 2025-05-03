import { Component, OnInit } from '@angular/core';
import { TemoinageService } from 'src/app/services/temoinage.service';
import { Temoinage } from 'src/app/front_end/pages/models/temoinage';
import { TemoinageStatut } from 'src/app/front_end/pages/models/TemoinageStatut';

@Component({
  selector: 'app-temoinages-public',
  templateUrl: './temoinages-public.component.html',
  styleUrls: ['./temoinages-public.component.css']
})
export class TemoinagesPublicComponent implements OnInit {
  temoinages: Temoinage[] = [];

  constructor(private temoinageService: TemoinageService) {}

  ngOnInit(): void {
    this.temoinageService.getTemoinages().subscribe((data: Temoinage[]) => {
      // ⚠️ Filtrer pour ne garder que ceux ACCEPTÉS
      this.temoinages = data.filter(t => t.statut === TemoinageStatut.ACCEPTE);
    });
  }
  lireTemoinage(temoinage: any) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(temoinage.description); // Lire la description du témoignage
    synth.speak(utterance);
  }

}
