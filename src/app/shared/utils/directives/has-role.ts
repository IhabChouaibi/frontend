import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';

@Directive({
  selector: '[appHasRole]',
  standalone: false
})
export class HasRole {
  constructor(private tpl: TemplateRef<any>,
              private vcr: ViewContainerRef,
              private auth: AuthService) {}

  @Input() set hasRole(roles: string[]) {
    const userRoles = this.auth.getRole();
    const hasMatch = userRoles.some(r => roles.includes(r));
    if (hasMatch) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
