import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomCommonModule} from '../../_imports/CustomCommon.module';

export interface ImagePreviewData {
  imageUrl: string;
}

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [CustomCommonModule],
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.scss']
})
export class ImagePreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImagePreviewData
  ) {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
