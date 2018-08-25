export class RouteLocation {
  name: string;
  lat: number;
  lng: number;

  constructor(name: string, lat: number, lng: number) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
  }

  public toString(): string {
    return this.name + ',' + this.lat + ',' + this.lng;
  }
}
