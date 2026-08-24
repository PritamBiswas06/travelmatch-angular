import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ProblemCard {
  icon: string;
  title: string;
  quote: string;
}

interface ValueItem {
  number: string;
  title: string;
  description: string;
}

interface TimelineStage {
  label: string;
  title: string;
  description: string;
}

interface PersonaCard {
  title: string;
  description: string;
  photo: string;
}

interface DestinationSuggestion {
  name: string;
  country: string;
  image: string;
  budget: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  scrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = (typeof window !== 'undefined') && window.scrollY > 24;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  // ---- Content data. Replace imagery/copy as the product evolves. ----

  problemCards: ProblemCard[] = [
    {
      icon: 'calendar',
      title: 'Different schedules',
      quote: 'Your friends want to travel next month. You wanted to go now.'
    },
    {
      icon: 'wallet',
      title: 'Different budgets',
      quote: "Your ideal trip doesn't fit everyone else's budget."
    },
    {
      icon: 'compass',
      title: 'Different travel styles',
      quote: 'You want mountains. They want beaches. Someone wants neither.'
    },
    {
      icon: 'search',
      title: 'Finding people',
      quote: "The hardest part isn't choosing where to go. It's finding who to go with."
    }
  ];

  values: ValueItem[] = [
    { number: '01', title: 'People over profiles', description: 'A profile is a starting point, not the destination. We optimize for real conversations, not endless browsing.' },
    { number: '02', title: 'Compatibility over popularity', description: 'The right travel companion isn\u2019t the most-liked profile. It\u2019s the one whose trip actually fits yours.' },
    { number: '03', title: 'Experiences over checklists', description: 'A good trip isn\u2019t a list of landmarks. It\u2019s shaped by who you share it with.' },
    { number: '04', title: 'Safety before convenience', description: 'Every shortcut we could take to grow faster gets weighed against what it costs user trust.' },
    { number: '05', title: 'Technology should bring people closer', description: 'Matching only matters if it leads to a real conversation, then a real trip.' },
    { number: '06', title: 'Travel should feel accessible', description: 'Compatible companions shouldn\u2019t be a luxury reserved for people with the biggest existing network.' }
  ];

  timeline: TimelineStage[] = [
    { label: 'Discover', title: 'Find where people are headed', description: 'Browse destinations and trips already open to new travelers.' },
    { label: 'Plan', title: 'Shape your own trip', description: 'Set your destination, dates, budget and the kind of trip you want.' },
    { label: 'Match', title: 'See who fits', description: 'TravelMatch ranks travelers heading your way by real compatibility.' },
    { label: 'Connect', title: 'Start the conversation', description: 'Message a match directly once you both choose to.' },
    { label: 'Travel', title: 'Take the trip', description: 'Confirm the itinerary and go, with company you actually chose.' },
    { label: 'Remember', title: 'Carry it forward', description: 'Stay in touch, plan trip two, or meet someone new for the next one.' }
  ];

  personas: PersonaCard[] = [
    { title: 'The Backpacker', description: 'Light bag, loose plans, always chasing the next train.', photo: 'https://i.pravatar.cc/160?img=12' },
    { title: 'The Weekend Explorer', description: 'Two days, one destination, maximum use of a Saturday.', photo: 'https://i.pravatar.cc/160?img=25' },
    { title: 'The Photographer', description: 'Plans routes around golden hour and quiet corners.', photo: 'https://i.pravatar.cc/160?img=33' },
    { title: 'The Foodie', description: 'Picks destinations by what\u2019s on the plate first.', photo: 'https://i.pravatar.cc/160?img=41' },
    { title: 'The Adventure Seeker', description: 'Trekking poles packed before the ticket is booked.', photo: 'https://i.pravatar.cc/160?img=15' },
    { title: 'The Slow Traveler', description: 'One city, two weeks, no itinerary past day one.', photo: 'https://i.pravatar.cc/160?img=47' },
    { title: 'The Digital Nomad', description: 'Good wifi and a decent desk chair, non-negotiable.', photo: 'https://i.pravatar.cc/160?img=52' },
    { title: 'The First-Time Solo Traveler', description: 'Ready to go alone, just not entirely alone.', photo: 'https://i.pravatar.cc/160?img=9' }
  ];

  aiDestinations: DestinationSuggestion[] = [
    { name: 'Manali', country: 'India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=500&q=80', budget: '₹13,200 est.' },
    { name: 'Rishikesh', country: 'India', image: 'https://images.unsplash.com/photo-1591016749296-cc46dfc3d29e?auto=format&fit=crop&w=500&q=80', budget: '₹11,800 est.' },
    { name: 'Pondicherry', country: 'India', image: 'https://images.unsplash.com/photo-1600100397608-f96c9c9c6a97?auto=format&fit=crop&w=500&q=80', budget: '₹14,500 est.' }
  ];

  whatsNext: string[] = [
    'Smarter matching as more trips and preferences are shared',
    'Deeper trip planning tools inside the platform',
    'More destination discovery, beyond the most obvious routes',
    'Community experiences, not just one-to-one matches',
    'Expanded safety tools as the community grows',
    'A more capable AI travel assistant'
  ];

  trackByIndex(index: number): number {
    return index;
  }
}