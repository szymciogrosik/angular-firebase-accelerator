import {DialogType} from "./dialog-type";

export interface DialogData {
  readonly title: string;
  readonly popupType: DialogType | null;
  readonly message: string;
  readonly cancelButtonText: string | null;
  readonly confirmButtonText: string;
}
