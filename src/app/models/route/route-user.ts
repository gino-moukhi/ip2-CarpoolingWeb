import {Name} from '../user/name';
import {Vehicle} from '../user/vehicle';
import {User} from '../user/user';

export class RouteUser {
  id: string;
  email: string;
  name: Name;
  age: number;
  gender: string;
  smoker: boolean;
  vehicle: Vehicle;


  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.age = user.age;
    this.gender = user.gender;
    this.smoker = user.smoker;
    this.vehicle = user.vehicle;
  }
}
