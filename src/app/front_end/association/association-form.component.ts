// association-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssociationService } from 'src/app/front_end/association/services/association.service';
import { Association } from 'src/app/front_end/association/association.model';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-association-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2>{{ isEdit ? 'Modifier une association' : 'Créer une association' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Nom :</label>
        <input type="text" id="name" formControlName="name" />
      </div>
      <div>
        <label for="description">Description :</label>
        <textarea id="description" formControlName="description"></textarea>
      </div>
      <button type="submit" [disabled]="form.invalid">
        {{ isEdit ? 'Mettre à jour' : 'Créer' }}
      </button>
    </form>
  `
})
export class AssociationFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  associationId: string;

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService
  ) {
    this.associationId = '';
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.isEdit) {
      this.updateAssociation();
    } else {
      this.createAssociation();
    }
  }

  createAssociation() {
    const newAssociation: Association = this.form.value;
    this.associationService.createAssociation(newAssociation).subscribe(() => {
      // Réinitialiser le formulaire ou naviguer vers la liste des associations
    });
  }

  updateAssociation() {
    const updatedAssociation: Association = {
      ...this.form.value,
      id: this.associationId
    };
    this.associationService
      .updateAssociation(this.associationId, updatedAssociation)
      .subscribe(() => {
        // Réinitialiser le formulaire ou naviguer vers la liste des associations
      });
  }

  loadAssociation(id: string) {
    this.isEdit = true;
    this.associationId = id;
    this.associationService.getAssociations().subscribe(association => {
      this.form.patchValue(association);
    });
  }
}
