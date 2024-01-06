import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  notesSaved: { title: string, _id: string }[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getSavedNotes()
  }

  getSavedNotes(){
    this.apiService.getNotesSaved().subscribe({
      next: (response: any) => {
        this.notesSaved = response.data.notesData;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  selectNote(noteTitle: string) {
    this.apiService.setSelectedNote(noteTitle);
  }


  createNote() {
    // Crea una nueva nota vacía y establece como seleccionada
    const newNote: any = { title: 'Nueva Nota', content: 'Escribe **aquí**' };

    this.apiService.createNote(newNote).subscribe({
      next: (response: any) => {
        this.getSavedNotes();
        this.selectNote(response.data.note_id);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    
  }
}
