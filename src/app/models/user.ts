import {Name} from './name';
import {Address} from './address';
import {Vehicle} from './vehicle';

export class User {
  id: string;
  email: string;
  password: string;
  name: Name;
  address: Address;
  age: number;
  gender: string;
  smoker: boolean;
  vehicle: Vehicle;
}
