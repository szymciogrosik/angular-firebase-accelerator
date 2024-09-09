import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {RegistrationGuardService} from "./registration-guard.service";

export const registrationEnabledGuard = (next: ActivatedRouteSnapshot) => {
  const registrationGuardService = inject(RegistrationGuardService);
  return registrationGuardService.isRegistrationAllowed()
    .then(enabled => {
      if (enabled) {
        return true;
      } else {
        window.location.href = RedirectionEnum.HOME;
        return false;
      }
    });
};
