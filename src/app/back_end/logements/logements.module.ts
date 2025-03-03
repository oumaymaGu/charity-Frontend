import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ListeLogementComponent } from './liste-logement/liste-logement.component';
import { AjouterLogementComponent } from './ajouter-logement/ajouter-logement.component';
import { ModifierLogementComponent } from './modifier-logement/modifier-logement.component';

@NgModule({
  declarations: [
    ListeLogementComponent,
    AjouterLogementComponent,
    ModifierLogementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    ListeLogementComponent,
    AjouterLogementComponent,
    ModifierLogementComponent
  ]
})
export class LogementsModule { } 