import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MapAnchorPoint, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import { Loader } from "@googlemaps/js-api-loader"

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() height = '300px';
  @Input() center!: google.maps.LatLngLiteral;
  //  = {
  //   lat: 49.836768,
  //   lng: 24.034245,
  // };
  @Input() zoom = 11;
  @Input() address!: string;
  @Input() markerArray: Array<google.maps.MarkerOptions> = [];
  @Output() currentTerminal: EventEmitter<any> = new EventEmitter<any>();
  @Input() mapZonesArray!: Array<any>;
  @Input() mapTheme: Array<google.maps.MapTypeStyle> = [];
  @ViewChild('maps', { static: false }) maps: any;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  mapLoaded!: boolean;
  // Map settings
  mapOptions: google.maps.MapOptions = {
    // center: this.center,
    zoom: this.zoom,
    maxZoom: 16,
    minZoom: 3,
    draggable: true,
    disableDefaultUI: true,
    clickableIcons: false,
    disableDoubleClickZoom: true,
    fullscreenControl: false,
    gestureHandling: 'cooperative',
    keyboardShortcuts: false,
    mapTypeControl: false,
    noClear: false,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    scrollwheel: false,
    streetViewControl: false,
    zoomControl: false,
    styles: [
      // {
      //   featureType: 'all',
      //   elementType: 'labels.text.fill',
      //   stylers: [
      //     {
      //       saturation: 36
      //     },
      //     {
      //       color: '#ffffff'
      //     },
      //     {
      //       lightness: 40
      //     }
      //   ]
      // },
      // {
      //   featureType: 'all',
      //   elementType: 'labels.text.stroke',
      //   stylers: [
      //     {
      //       visibility: 'on'
      //     },
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 16
      //     }
      //   ]
      // },
      // {
      //   featureType: 'all',
      //   elementType: 'labels.icon',
      //   stylers: [
      //     {
      //       visibility: 'off'
      //     }
      //   ]
      // },
      // {
      //   featureType: 'administrative',
      //   elementType: 'geometry.fill',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 20
      //     }
      //   ]
      // },
      // {
      //   featureType: 'administrative',
      //   elementType: 'geometry.stroke',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 17
      //     },
      //     {
      //       weight: 1.2
      //     }
      //   ]
      // },
      // {
      //   featureType: 'landscape',
      //   elementType: 'geometry',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 20
      //     }
      //   ]
      // },
      // {
      //   featureType: 'poi',
      //   elementType: 'geometry',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 21
      //     }
      //   ]
      // },
      // {
      //   featureType: 'road.highway',
      //   elementType: 'geometry.fill',
      //   stylers: [
      //     {
      //       color: '#BE2026'
      //     },
      //     {
      //       lightness: 17
      //     }
      //   ]
      // },
      // {
      //   featureType: 'road.highway',
      //   elementType: 'geometry.stroke',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 29
      //     },
      //     {
      //       weight: 0.2
      //     }
      //   ]
      // },
      // {
      //   featureType: 'road.arterial',
      //   elementType: 'geometry',
      //   stylers: [
      //     {
      //       color: '#575757'
      //     },
      //     {
      //       lightness: 18
      //     }
      //   ]
      // },
      // {
      //   featureType: 'road.local',
      //   elementType: 'geometry',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 16
      //     }
      //   ]
      // },
      // {
      //   featureType: 'transit',
      //   elementType: 'geometry',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 19
      //     }
      //   ]
      // },
      // {
      //   featureType: 'water',
      //   elementType: 'geometry',
      //   stylers: [
      //     {
      //       color: '#000000'
      //     },
      //     {
      //       lightness: 17
      //     }
      //   ]
      // }
    ]
  };

  polygonOptions: Array<google.maps.PolygonOptions> = [];
  infoMarker: any = '';

  constructor(private themeOptionsService: ThemeOptionsService) {
  }

  ngOnInit() {
    this.mapOptions.styles = this.mapTheme;

    this.initMap();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges() {
    if (this.address && this.mapLoaded) {
      this.addMarkerByLocation();
    }
    this.addPolygon();
  }

  initMap() {
    this.themeOptionsService.getMap.subscribe(
      (data) => {
        const loader = new Loader({
          apiKey: data,
          version: "weekly",
          libraries: ['places', 'geometry']
        });
        loader.load().then(() => {
          this.setMap();
          this.addPolygon();
          this.mapLoaded = true;
        });
      },
      () => {
        this.mapLoaded = false;
      }
    );
  }

  openInfoWindow(marker: MapMarker) {
    // console.log(marker.marker.getTitle(), this.infoWindow);
    // this.closeTopWindow.emit(true);
    if (marker?.marker?.getTitle()) {
      this.infoMarker = marker?.marker?.getTitle();
      // this.infoWindow.infoWindow.setContent(marker.marker.getTitle());
      this.infoWindow.open(marker);
    }
  }

  setMap() {
    const bounds = new google.maps.LatLngBounds();
    if (this.markerArray?.length) {
      this.markerArray?.forEach((marker: any) => {
        // bounds.extend(new google.maps.Marker(marker).getPosition());
        bounds.extend(marker?.position);
      });
      this.maps?.fitBounds(bounds);
    }
  }

  addPolygon() {
    // if (!this.polygonOptions?.length) { - для того щоб зона більше не перезаписувалася(підходять для Файних Льодів)
    this.polygonOptions = [];
    this.mapZonesArray?.forEach((zone) => {
      zone?.zoneLocations?.forEach((polygon: any) => {
        this.polygonOptions.push({ ...zone, paths: polygon.path });
        // console.log(this.polygonOptions);
      });
    });
    // }
  }

  // add marker by location
  // addMarkerByLocation() {
  //   if (!this.address?.includes('null')) {
  //     // console.log(this.address);
  //     let position;
  //     const geocoder = new google.maps.Geocoder();
  //     geocoder.geocode(
  //       { address: this.address }, //  + 'Львів'
  //       async (results: any, status) => {
  //         if (status === 'OK' && results[0].geometry.location) {
  //           position = results[0].geometry.location;
  //           this.markerArray = [];
  //           this.markerArray.push({
  //             position: position?.toJSON(),
  //             draggable: false,
  //             icon: './assets/img/icon/marker-icon.svg' // '/assets/img/icon/user-icon.svg'
  //           });
  //           this.setMap();
  //           this.checkIfPolygonContainsMarker(position);
  //         } else {
  //           this.currentTerminal.emit(undefined);
  //         }
  //       }
  //     );
  //   }
  // }

  // маршрути
  addMarkerByLocation() {
    const origin = 'Демидівка, Рівненська обасть';
    const destination = 'Луцьк, Волинська область';
    // const between = [{location: new google.maps.LatLng({lat: 49.547492, lng: 25.544970}), stopover: false}];
    const between = [{location: new google.maps.LatLng({lat: 49.576431, lng: 25.184011}), stopover: false}];
    let route = new google.maps.DirectionsService;

    // console.log(this.address);
    let position: any;
    let geocoder = new google.maps.Geocoder;
    // geocoder.geocode({ address: this.address + 'Львів' }, async (results: any, status) => {
    // geocoder.geocode({ address: this.address}, async (results: any, status) => {
    //   if (status === 'OK' && results[0].geometry.location) {
    //     position = results[0].geometry.location;
    //     this.markerArray = [];
    //     this.markerArray.push({
    //       position: position,
    //       draggable: false,
    //       icon: '/assets/img/icon/user-icon.svg'
    //     });
    //     this.setMap();
    //     this.checkIfPolygonContainsMarker(position);

        const d: Date = new Date();
        const requests = {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {departureTime: d, trafficModel: google.maps.TrafficModel.PESSIMISTIC},
          // waypoints: between,
          provideRouteAlternatives: true,
          // optimizeWaypoints: true,
          unitSystem: 0
        };

        route.route(requests, async (routeResults: any, routeStatus) => {
          // console.log(routeResults, routeStatus);


          if (routeStatus === 'OK') {
             routeResults?.routes?.forEach((road: any, index: number) => {
              let item = routeResults;
              item.routes = [road];

              let renderRoute = new google.maps.DirectionsRenderer;
              renderRoute.setOptions({
                directions: item,
                routeIndex: index,
                // polylineOptions: {
                //   clickable: true
                // },
                suppressPolylines: false,
                hideRouteList: false,
                map: this.maps.googleMap,
                suppressMarkers: false,
                markerOptions: {
                  position: position,
                  draggable: false,
                  icon: '/assets/img/icon/user-icon.svg'
                  // icon: '/assets/icon/courier-marker.svg'
                }
              });
            });
          }
        });
    //   } else {
    //     this.currentTerminal.emit('outside');
    //   }
    // });
  }

  foo(event?: any) {
    console.log('event', event);
  }

  // check if the address falls into the some polygon
  checkIfPolygonContainsMarker(point: any) {
    const check = google.maps.geometry.poly;
    const selectPolyWithMarker = this.polygonOptions.find((poly) =>
      check.containsLocation(point, new google.maps.Polygon(poly))
    );
    // console.log(selectPolyWithMarker);
    this.currentTerminal.emit(selectPolyWithMarker);
  }

  ngOnDestroy() {
    this.polygonOptions = [];
  }
}
