import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  @Input() headers: string[] = []; // Les titres du tableau
  @Input() columns: string[] = []; // Les noms des colonnes (correspondants aux clés des objets dans `data`)
  @Input() data: any[] = []; // Les données du tableau
  @Input() templates: { [key: string]: TemplateRef<any> } = {}; // Les templates personnalisés
}
