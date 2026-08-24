import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Destination {
  code: string;
  country: string;
  name: string;
  image: string;
  dateRange: string;
  travelers: number;
  budget: string;
  style: string;
  avatars: string[];
}

interface Story {
  name: string;
  age: number;
  from: string;
  destination: string;
  tripType: string;
  rating: number;
  photo: string;
  quote: string;
}

interface ActivityItem {
  avatar: string;
  text: string;
  time: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

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

  // ---- Demo / placeholder data. Replace with live API data. ----

  destinations: Destination[] = [
    {
      code: 'GOI', country: 'India', name: 'Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80',
      dateRange: 'Sept 10 – 15', travelers: 12, budget: '₹10k–15k', style: 'Beach & nightlife',
      avatars: ['https://i.pravatar.cc/60?img=32', 'https://i.pravatar.cc/60?img=45', 'https://i.pravatar.cc/60?img=12']
    },
    {
      code: 'MNL', country: 'India', name: 'Manali',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80',
      dateRange: 'Oct 2 – 7', travelers: 8, budget: '₹8k–14k', style: 'Mountains & trekking',
      avatars: ['https://i.pravatar.cc/60?img=15', 'https://i.pravatar.cc/60?img=22', 'https://i.pravatar.cc/60?img=9']
    },
    {
      code: 'DPS', country: 'Indonesia', name: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80',
      dateRange: 'Nov 4 – 12', travelers: 17, budget: '₹35k–55k', style: 'Retreat & culture',
      avatars: ['https://i.pravatar.cc/60?img=5', 'https://i.pravatar.cc/60?img=25', 'https://i.pravatar.cc/60?img=41']
    },
    {
      code: 'DXB', country: 'UAE', name: 'Dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80',
      dateRange: 'Dec 18 – 23', travelers: 6, budget: '₹45k–70k', style: 'City & luxury',
      avatars: ['https://i.pravatar.cc/60?img=19', 'https://i.pravatar.cc/60?img=33']
    }
  ];

  stories: Story[] = [
    {
      name: 'Naomi R.', age: 29, from: 'Bengaluru', destination: 'Torres del Paine, Patagonia',
      tripType: '9-day trek', rating: 5, photo: 'https://i.pravatar.cc/120?img=47',
      quote: 'Posted my route on a Tuesday, had two trail-ready companions by the weekend. Trip three is already in the works.'
    },
    {
      name: 'Arjun K.', age: 27, from: 'Mumbai', destination: 'Hampta Pass, Manali',
      tripType: '4-day trek', rating: 5, photo: 'https://i.pravatar.cc/120?img=51',
      quote: 'Matched with two people whose pace and budget lined up exactly with mine. We still text most weeks.'
    },
    {
      name: 'Priya S.', age: 24, from: 'Delhi', destination: 'Ubud, Bali',
      tripType: '10-day retreat', rating: 4, photo: 'https://i.pravatar.cc/120?img=44',
      quote: 'I was nervous about traveling solo. The verified profiles and shared itinerary made the whole thing feel low-risk.'
    },
    {
      name: 'Devika M.', age: 31, from: 'Pune', destination: 'Lisbon, Portugal',
      tripType: '6-day city trip', rating: 5, photo: 'https://i.pravatar.cc/120?img=48',
      quote: 'Found someone with the exact same taste in food and pace of walking. That never happens on group chats.'
    }
  ];

  activity: ActivityItem[] = [
    { avatar: 'https://i.pravatar.cc/60?img=32', text: 'Arjun created a Goa trip · Sept 10–15', time: '2m ago' },
    { avatar: 'https://i.pravatar.cc/60?img=44', text: 'Priya found a 94% match for Ubud', time: '8m ago' },
    { avatar: 'https://i.pravatar.cc/60?img=15', text: 'Rahul is looking for a Manali companion', time: '19m ago' },
    { avatar: 'https://i.pravatar.cc/60?img=41', text: '4 travelers joined the Bali retreat trip', time: '32m ago' },
    { avatar: 'https://i.pravatar.cc/60?img=19', text: 'Devika confirmed a Lisbon itinerary', time: '1h ago' }
  ];

  features: FeatureItem[] = [
    { icon: 'compass', title: 'Smart matching', description: 'Ranked by destination, dates, budget and travel style — not popularity.' },
    { icon: 'map', title: 'Trip planning', description: 'Draft an itinerary and share it before anyone commits to travel.' },
    { icon: 'bot', title: 'AI travel assistant', description: 'Get a budget-aware plan for any destination in seconds.' },
    { icon: 'id', title: 'Travel profiles', description: 'Pace, interests and past trips, laid out at a glance.' },
    { icon: 'chat', title: 'Private chat', description: 'Message a match directly once you both opt in.' },
    { icon: 'shield', title: 'Safety tools', description: 'Report, block and verification controls on every profile.' },
    { icon: 'wallet', title: 'Budget matching', description: 'See compatible spend ranges before you start talking.' },
    { icon: 'users', title: 'Community', description: 'Follow trip activity from travelers heading your way.' }
  ];

  comparisonRows = [
    { label: 'Compatibility check', alone: false, groups: false, travelmatch: true },
    { label: 'Verified profiles', alone: null, groups: false, travelmatch: true },
    { label: 'Shared dates & budget upfront', alone: false, groups: false, travelmatch: true },
    { label: 'Structured itinerary', alone: false, groups: false, travelmatch: true },
    { label: 'Report & block tools', alone: null, groups: false, travelmatch: true },
    { label: 'AI trip planning', alone: false, groups: false, travelmatch: true }
  ];

  trackByIndex(index: number): number {
    return index;
  }
}