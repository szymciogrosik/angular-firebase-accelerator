import {computed, inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {firstValueFrom} from 'rxjs';
import {UserDbService} from './user-db-service.service';
import {CustomUser} from '../../_models/user/custom-user';

@Injectable({
  providedIn: 'root'
})
export class UserFacade {
  private userDb = inject(UserDbService);

  /**
   * Raw signal of all users in the database
   */
  public readonly allUsers = toSignal(this.userDb.getAll());

  /**
   * Computed signal of active, non-deleted users, sorted alphabetically
   */
  public readonly activeUsers = computed(() => {
    const users = this.allUsers();
    if (!users) return undefined;
    return users.filter(u => !u.isDeleted).sort((a, b) => a.firstName.localeCompare(b.firstName));
  });

  /**
   * Computed signal of deleted users, sorted alphabetically
   */
  public readonly deletedUsers = computed(() => {
    const users = this.allUsers();
    if (!users) return undefined;
    return users.filter(u => u.isDeleted).sort((a, b) => a.firstName.localeCompare(b.firstName));
  });

  public async getUserByEmailAsync(email: string): Promise<CustomUser[]> {
    return firstValueFrom(this.userDb.getUserByEmail(email));
  }

  public async deleteUser(id: string): Promise<void> {
    return this.userDb.delete(id);
  }

  public async updateUser(docId: string, updatedUser: Partial<CustomUser>): Promise<void> {
    return this.userDb.update(docId, updatedUser);
  }

  public async createUser(newUser: CustomUser): Promise<void> {
    return this.userDb.create(newUser);
  }
}
