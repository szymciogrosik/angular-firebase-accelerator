import {Injectable} from '@angular/core';
import {RedirectionEnum} from "../../../utils/redirection.enum";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ActiveTabService {

  constructor(private router: Router) { }

  public isHomePageActive(): boolean {
    const currentRoute: string = this.router.url;
    return this.isHomePage(currentRoute);
  }

  private isHomePage(currentRoute: string): boolean {
    let allPaths: RedirectionEnum[] = Object.values(RedirectionEnum);
    for (let i = 0; i < Object.values(RedirectionEnum).length; i++) {
      let redirection: RedirectionEnum = allPaths[i]
      if (currentRoute.includes('/' + redirection)) {
        if (!(redirection === RedirectionEnum.HOME) && !(redirection === RedirectionEnum.SEP)) {
          return false;
        }
      }
    }
    return true;
  }

  public isAdminPageActive(): boolean {
    const currentRoute: string = this.router.url;
    return currentRoute.includes('/' + RedirectionEnum.ADMIN);
  }

}
