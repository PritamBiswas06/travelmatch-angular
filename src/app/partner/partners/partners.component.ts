import { Component, OnInit } from '@angular/core';
import { PartnerService } from '../partner.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../../core/loader.service'; // 👈 add

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {

  partners: any[] = [];
  currentUserId: number = Number(localStorage.getItem('userId'));

  constructor(
    private partnerService: PartnerService,
    private router: Router,
    private loader: LoaderService   // 👈 inject loader
  ) {}

  ngOnInit(): void {

    // 🔵 Show loader while fetching partners
    this.loader.show("Loading your travel partners...");

    this.partnerService.getMyPartners().subscribe({
      next: (res: any) => {
        this.partners = res;
        this.loader.hide(); // hide loader
      },
      error: () => {
        this.loader.hide();
      }
    });
  }

  /**
   * Get partner name
   */
  getPartnerName(partner: any): string {
    if (partner.userOne.id === this.currentUserId) {
      return partner.userTwo.name;
    } else {
      return partner.userOne.name;
    }
  }

  /**
   * Open chat with loader
   */
  openChat(partner: any) {

    // 🔵 Show loader
    this.loader.show("Connecting to partner...");

    let otherUserId;

    if (partner.userOne.id === this.currentUserId) {
      otherUserId = partner.userTwo.id;
    } else {
      otherUserId = partner.userOne.id;
    }

    setTimeout(() => {
      this.loader.hide();
      this.router.navigate(['/chat', otherUserId]);
    }, 700); // small delay for smooth animation
  }

}