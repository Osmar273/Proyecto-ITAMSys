import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // 1. Si no está logueado, lo obligamos a loguearse
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }

    // 2. Verificamos si la ruta pide roles específicos
    const requiredRoles = route.data['roles'];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. 🔥 EL CAMBIO ESTÁ AQUÍ: Usamos .some() en lugar de .every()
    // Significa "Déjalo entrar si tiene AL MENOS UNO de los roles requeridos"
    return requiredRoles.some((role: string) => this.roles.includes(role));
  }
}
