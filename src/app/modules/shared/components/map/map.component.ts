import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/img/marker-icon-2x.png';
const iconUrl = 'assets/img/marker-icon.png';
const shadowUrl = 'assets/img/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit {



  @Input() click: boolean = true;
  @Input() lat: number;
  @Input() lng: number;
  @Input() object: Object[];
  @Input() latList: number[];
  @Input() lngList: number[];
  @Output() public lngChange: EventEmitter<number> = new EventEmitter();
  @Output() public latChange: EventEmitter<number> = new EventEmitter();

  constructor(private el: ElementRef) { }
  marker;
  private map;
  private initMap(): void {
    this.map = L.map(this.el.nativeElement.querySelector('#map'), {
      center: [40, 40],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    this.addMarker(null, this.lat, this.lng, this.latList, this.lngList, this.object)
    if (this.click)
      this.map.on("click", (e) => this.addMarker(e))
  }
  addMarker(e, lat?, lng?, latList?, lngList?, object?) {
    // Add marker to map at click location; add popup window
    if (this.marker != undefined) {
      this.map.removeLayer(this.marker)
    }
    if (e != null) {
      this.marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.map.flyTo([e.latlng.lat, e.latlng.lng], 15);
      this.latChange.emit(e.latlng.lat)
      this.lngChange.emit(e.latlng.lng)
    }
    else if (lat != null) {
      this.marker = new L.Marker([lat, lng]).addTo(this.map);
      this.map.flyTo([lat, lng], 15);
    } else if (latList != undefined) {
      for (let i = 0; i < latList.length; i++) {
        if (latList[i] != null) {
          this.marker = new L.Marker([latList[i], lngList[i]]).addTo(this.map);
          if (object != null) {
            this.marker.bindPopup(
              '<div class="row w-300px">' +
                (object[i].image ? '<div class="col-12 text-center align-self-center">' +
                  ' <img style="width: 70%;padding: 20px" src="' + object[i].image + '"/>' +
                '</div>' : '')+
                '<div class="col-12">' +
                    '<div class="popup-item">' +
                       '<i class="fa fa-phone fa-lg"></i>' + '<p class="popup-text"> ' + object[i].phoneCountryCodeOne + object[i].phoneNumberOne + '</p>' +
                    '</div>' +
                   (object[i]?.phoneNumberTwo ? '<div class="popup-item">' +
                       '<i class="fa fa-phone fa-lg"></i>' + '<p class="popup-text"> ' + object[i]?.phoneCountryCodeTwo + object[i]?.phoneNumberTwo + '</p>' +
                    '</div>' : '') +
                    '<div class="popup-item">' +
                       '<i class="fa fa-envelope fa-lg"></i>' + '<p class="popup-text"> ' + object[i]?.email + '</p>' +
                    '</div>' +
                   (object[i].fax ? '<div class="popup-item">' +
                        '<i class="fas fa-fax fa-lg"></i>' + '<p class="popup-text"> ' + object[i]?.fax + '</p>' +
                    '</div>' : '' )+
                    '<div class="popup-item">' +
                        '<i class="fa fa-map-marker fa-lg"></i>' + '<p class="popup-text"> ' + object[i]?.address + '</p>' +
                    '</div>' +
                '</div>' +
              '</div>',
            );
          }
        }
      }
      this.map.flyTo([latList[0], lngList[0]], 15);
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 1000)
  }
  ngOnInit(): void {
  }

}
