import {DateTime} from "luxon";

export class RegistrationSettings {
  registrationEnabled: boolean;
  startRegistrationDateTime: string;

  constructor(data: Partial<RegistrationSettings>) {
    this.registrationEnabled = data.registrationEnabled ?? false;
    this.startRegistrationDateTime = data.startRegistrationDateTime ?? DateTime.now().toString();
  }
}
