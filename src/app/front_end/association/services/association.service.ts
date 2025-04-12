// association.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Association } from 'src/app/front_end/association/association.model';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {
  private apiUrl = 'http://localhost:4200/associations';

  constructor(private http: HttpClient) {}

 

  getAssociations(id?: string): Observable<Association[]> {
    return this.http.get<Association[]>(this.apiUrl);
  }

  createAssociation(association: Association): Observable<Association> {
    return this.http.post<Association>(this.apiUrl, association);
  }

  updateAssociation(id: string, association: Association): Observable<Association> {
    return this.http.put<Association>(`${this.apiUrl}/${id}`, association);
  }

  deleteAssociation(id: string) {
    return this.http.delete(`${this.apiUrl}/association/${id}`);
  }
  
}
