import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-loader.component.html',
  styleUrl: './spinner-loader.component.css'
})
export class SpinnerLoaderComponent {
  @Input() messageLoader: string = "Traitement en cours..."
  @Input() messageSucess: string = "Traitement terminer.";
  @Input() messageError: string = "Erreur lors du traitement.";
  protected isOpen: boolean = false;
  protected isSucces: boolean = true;
  protected loading: boolean = false;

  open = () => { this.isOpen = true; this.loading = true; };
  close = () => { this.isOpen = false; this.loading = false; };
  succes = (value: boolean = true) => { this.loading = false; this.isSucces = value; };
}
