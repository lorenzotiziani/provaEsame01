import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {Request} from "../../entities/Request.Entity";
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  requests: Request[] = [];
  requestsToApprove: Request[] = [];
  currentUser$ = this.authService.currentUser$;
  newRequestForm!: FormGroup;

  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.newRequestForm = this.fb.group({
      dataInizio: ['', Validators.required],
      dataFine: ['', Validators.required],
      categoriaId: [null, Validators.required],
      motivazione: ['', Validators.required]
    });

    this.currentUser$.subscribe(user => {
      console.log(user);
      if (!user) return;

      if (user.role === 'dipendente') {
        this.requestsService.getRequests().subscribe(res => this.requests = res.data || []);
      }

      if (user.role === 'admin') {
        this.requestsService.getRequestsToApprove().subscribe(res => this.requestsToApprove = res.data || []);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe();
  }

  details(id: number) {
    this.router.navigate(['/requests', id]);
  }

  submitNewRequest() {
    if (this.newRequestForm.invalid) return;

    const data = this.newRequestForm.value;
    this.requestsService.createRequest(data).subscribe({
      next: res => {
        alert('Richiesta creata con successo!');
        this.requests.push(res.data);
        this.newRequestForm.reset();
      },
      error: err => {
        console.error('Errore creazione richiesta:', err);
        alert('Errore nella creazione della richiesta');
      }
    });
  }

  handleRequest(requestId: number, stato: "Approvato" | "Rifiutato") {
    this.requestsService.updateRequestStatus(requestId, stato).subscribe({
      next: res => {
        alert(`Richiesta ${stato.toLowerCase()} con successo`);
        this.requestsToApprove = this.requestsToApprove.filter(r => r.id !== requestId);
      },
      error: err => {
        console.error(err);
        alert('Errore durante l\'operazione');
      }
    });
  }
}