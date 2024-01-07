import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  selectedNote: string = '';
  note: {  _id: string, title: string, content: string, shared: any } = { _id: '', title: '', content: '', shared: '' };
  editing: boolean = false;

  constructor(private apiService: ApiService) {
    this.apiService.selectedNote$.subscribe((noteId) => {
      this.selectedNote = noteId;
      if (this.selectedNote !== '') {
        this.getNote();
      }
    });
  }

  ngOnInit(): void {
  }

  getNote() {
    this.apiService.getNote(this.selectedNote).subscribe({
      next: (response: any) => {
        this.note = response.data.note;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  toggleEditing() {
    this.editing = !this.editing;
  }

  saveChanges() {
    this.apiService.updateNote(this.note._id, this.note).subscribe({
      next: (response: any) => {
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    
    this.toggleEditing();
  }

  cancelEditing() {
    // Puedes implementar la lógica para cancelar la edición
    this.getNote(); // Recarga la nota original
    this.toggleEditing(); // Cambia el modo de edición después de cancelar
  }

  deleteNote() {
    const confirmation = confirm("¿Estás seguro de que quieres eliminar la nota?");
  
    if (confirmation) {
      this.apiService.deleteNote(this.note._id).subscribe({
        next: (response: any) => {
          console.log("Nota eliminada exitosamente:", response);
          window.location.reload()
        },
        error: (error: any) => {
          console.error("Error al eliminar la nota:", error);
        }
      });
    }
  }

  shareNote(){
    this.apiService.shareNote(this.note._id).subscribe({
      next: (response: any) => {
        console.log(response)
      },
      error: (error: any) => {
        console.error(error);
      }
    });

  }
  
}
