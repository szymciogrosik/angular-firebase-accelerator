import {Component, OnInit} from '@angular/core';
import {CustomCommonModule} from "../../../_imports/CustomCommon.module";
import {PublicSettingsService} from "../../../_database/settings/public-settings.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SnackbarService} from "../../../_services/util/snackbar.service";
import {CustomTranslateService} from "../../../_services/translate/custom-translate.service";
import {doc, setDoc} from '@angular/fire/firestore';
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-public-settings',
  standalone: true,
  imports: [CustomCommonModule, ReactiveFormsModule, MatSlideToggle],
  templateUrl: './public-settings.component.html',
  styleUrl: './public-settings.component.scss'
})
export class PublicSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  loading: boolean = true;
  saving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private publicSettingsService: PublicSettingsService,
    private snackbarService: SnackbarService,
    private translateService: CustomTranslateService
  ) {
    this.settingsForm = this.formBuilder.group({
      allowForRegistering: [false]
    });
  }

  ngOnInit(): void {
    this.publicSettingsService.getDocument('general').subscribe({
      next: (data) => {
        if (data && data.allowForRegistering !== undefined) {
          this.settingsForm.patchValue({allowForRegistering: data.allowForRegistering});
        } else {
          this.settingsForm.patchValue({allowForRegistering: false});
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  async saveSettings(): Promise<void> {
    this.saving = true;
    try {
      const payload = {
        allowForRegistering: this.settingsForm.get('allowForRegistering')?.value
      };

      await this.publicSettingsService.update('general', payload).catch(async (e) => {
        if (e.code === 'not-found') {
          const docRef = doc((this.publicSettingsService as any).firestore, 'public_settings/general');
          await setDoc(docRef, payload);
        } else {
          throw e;
        }
      });
      this.snackbarService.openLongSnackBar(this.translateService.get('admin.panel.settings.public.savedSuccessfully'));
    } catch (err) {
      console.error(err);
      this.snackbarService.openLongSnackBar('Failed to save settings.');
    } finally {
      this.saving = false;
    }
  }
}
