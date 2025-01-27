import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-load-data',
  standalone: true,
  imports: [],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.css'
})
export class LoadDataComponent {
  @Input() appName:string = "KaayLeek";
}
