import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map!: L.Map;
  private markers: L.Marker[] = []; // Store markers

  @Input() eventsNearby: any[] = []; // Receive nearby events from parent component

  // Define a custom icon for events
  private eventIcon = L.divIcon({
    className: 'leaflet-svg-icon',
    html: `
      <svg viewBox="0 0 24 24" style="color: red; width: 20px; height: 20px;">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20]
  });

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventsNearby'] && this.map) {
      console.log("Updating nearby events:", this.eventsNearby);
      this.updateMarkers();
    }
  }

  private initMap(): void {
    if (!document.getElementById('map')) {
      console.error("❌ The 'map' element is not found. Ensure the ID is correctly defined in the HTML.");
      return;
    }

    this.map = L.map('map').setView([36.8065, 10.1815], 6); // Default view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.updateMarkers(); // Add markers initially
  }

  private updateMarkers(): void {
    // Remove old markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Filter events with valid coordinates
    const validEvents = this.eventsNearby.filter(event => event.latitude && event.longitude);

    // Add new markers for valid events
    validEvents.forEach(event => {
      const marker = L.marker([event.latitude, event.longitude], { icon: this.eventIcon })
        .addTo(this.map)
        .bindPopup(`<b>${event.nomEvent}</b><br>${event.lieu}`);
      this.markers.push(marker);
    });

    // Adjust the map view to fit all markers
    if (validEvents.length > 0) {
      const bounds = L.latLngBounds(validEvents.map(event => [event.latitude, event.longitude]));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      console.warn("❗ No valid events with coordinates to display on the map.");
    }
  }
}