import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmbeddedBrowserWarningData} from "../../_models/dialog/embedded-browser-warning/embedded-browser-warning-data";

@Component({
  selector: 'app-embedded-browser-popup',
  templateUrl: './embedded-browser-popup.component.html',
  styleUrl: './embedded-browser-popup.component.scss'
})
export class EmbeddedBrowserPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<EmbeddedBrowserPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmbeddedBrowserWarningData
  ) { }

  protected onCancelClick(): void {
    this.dialogRef.close(false);
  }

  protected onApproveClick(): void {
    this.dialogRef.close(true);
  }

}
