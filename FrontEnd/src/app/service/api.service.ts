import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:4000';
  private notesEndPoint = '/notes'

  private selectedNoteSubject = new BehaviorSubject<string>('');
  selectedNote$ = this.selectedNoteSubject.asObservable();

  constructor(private http: HttpClient) { }

  setSelectedNote(noteTitle: string) {
    this.selectedNoteSubject.next(noteTitle);
  }

  // Routes With API
  getApi(){
    const endpoint = `/api`;
    return this.http.get(`${this.apiUrl}${endpoint}`)
  }

  getNotesSaved(){
    const endpoint = `/getNotesSaved`;
    return this.http.get(`${this.apiUrl}${this.notesEndPoint}${endpoint}`)
  }

  getNote(id :string){
    const endpoint = `/getNote`;
    return this.http.get(`${this.apiUrl}${this.notesEndPoint}${endpoint}/${id}`)
  }

  createNote(note: any): Observable<any> {
    const endpoint = `/createNote`;
    return this.http.post(`${this.apiUrl}${this.notesEndPoint}${endpoint}`, note);
  }

  updateNote(id: string, note: any): Observable<any> {
    const endpoint = `/updateNote`;
    return this.http.put(`${this.apiUrl}${this.notesEndPoint}${endpoint}/${id}`, note);
  }

  deleteNote(id: string){
    const endpoint = `/deleteNote`;
    return this.http.delete(`${this.apiUrl}${this.notesEndPoint}${endpoint}/${id}`);
  }

}