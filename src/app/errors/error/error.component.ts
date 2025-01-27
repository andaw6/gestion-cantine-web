import { Component, OnInit } from '@angular/core';
import { ErrorService } from '@core/services/error.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  errorMessage: string | null= null;

  constructor(private errorService: ErrorService) { }

  ngOnInit(): void {
    this.errorMessage = this.errorService.getError();
    this.errorService.setError('');
  }

}
