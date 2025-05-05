import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Billet } from '../../services/event.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-billet',
  templateUrl: './billet.component.html',
  styleUrls: ['./billet.component.css']
})
export class BilletComponent implements OnInit {
  billet?: Billet;
  billetUrl: string = '';
  isLoggedIn: boolean = false;

  userName: string = '';
  username: string | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService

  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.eventService.getBillet(eventId, userId).subscribe(
      (billet) => {
        this.billet = billet;
       this.billetUrl = `http://192.168.1.100:4200/billet/${billet.id}`;      },
      (error: any) => {
        console.error("Erreur lors de la récupération du billet", error);
      }
    );
    this.username = this.authService.getUsername();

  }

  printBillet(): void {
    window.print();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}