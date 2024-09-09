import { Injectable, OnDestroy } from '@angular/core';
import { CustomTranslateService } from "../translate/custom-translate.service";
import * as XLSX from "xlsx";
import { ExcelQuestion } from "../../_models/registration/excel/excel-question";
import { select_area_of_serve } from "../../_models/registration/select/select-area-of-serve";
import { RegistrationGroup } from "./registration-group";
import { select_genders } from "../../_models/registration/select/select-gender";
import { select_known_languages } from "../../_models/registration/select/select-known-languages";
import { select_yes_no } from "../../_models/registration/select/select-yes-no";

@Injectable({
  providedIn: 'root'
})
export class ExportService implements OnDestroy {

  constructor(
    private translateService: CustomTranslateService
  ) {
  }

  ngOnDestroy(): void {
  }

  exportToExcel(
    excelTitle: string, youngData: any[], adultData: any[], staffData: any[]
  ): void {
    const sortedYoungData = this.sortDataColumns(youngData, this.getYoungColumnOrder(), RegistrationGroup.YOUNG);
    const sortedAdultData = this.sortDataColumns(adultData, this.getAdultColumnOrder(), RegistrationGroup.ADULT);
    const sortedStaffData = this.sortDataColumns(staffData, this.getStaffColumnOrder(), RegistrationGroup.STAFF);

    const wsYoung: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sortedYoungData);
    const wsAdult: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sortedAdultData);
    const wsStaff: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sortedStaffData);
    const wsYoungQuestions: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.createYoungQuestions());
    const wsAdultQuestions: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.createAdultQuestions());
    const wsStaffQuestions: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.createStaffQuestions());

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsYoung, '13_18');
    XLSX.utils.book_append_sheet(wb, wsAdult, '19_26');
    XLSX.utils.book_append_sheet(wb, wsStaff, 'Staff');
    XLSX.utils.book_append_sheet(wb, wsYoungQuestions, '13_18 - Questions');
    XLSX.utils.book_append_sheet(wb, wsAdultQuestions, '19_26 - Questions');
    XLSX.utils.book_append_sheet(wb, wsStaffQuestions, 'Staff - Questions');
    XLSX.writeFile(wb, excelTitle + '.xlsx');
  }

  private sortDataColumns(data: any[], columnOrder: string[], group: RegistrationGroup): any[] {
    return data.map(obj => {
      const orderedObj: any = {};
      columnOrder.forEach(column => {
        if (obj.hasOwnProperty(column)) {
          if (column.startsWith('question')) {
            orderedObj[column] = this.getQuestionValueTranslation(obj[column], parseInt(column.replace('question', '')), group);
          } else {
            // Common objects are boolean, so cannot be mapped to String for now...
            // orderedObj[column] = this.getCommonTranslation(obj[column], column);
            orderedObj[column] = obj[column];
          }
        }
      });
      return orderedObj;
    });
  }

  private getYoungColumnOrder(): string[] {
    return [
      'id',
      'creationTimestamp',
      'lastModificationTimestamp',
      'lastModificationUser',
      'advancePayed',
      'fullAmountPayed',
      'additionalComments',
      'deleted',
      ...this.getQuestionOrder(28)
    ];
  }

  private getAdultColumnOrder(): string[] {
    return [
      'id',
      'creationTimestamp',
      'lastModificationTimestamp',
      'lastModificationUser',
      'advancePayed',
      'fullAmountPayed',
      'additionalComments',
      'deleted',
      ...this.getQuestionOrder(19)
    ];
  }

  private getStaffColumnOrder(): string[] {
    return [
      'id',
      'creationTimestamp',
      'lastModificationTimestamp',
      'lastModificationUser',
      'advancePayed',
      'fullAmountPayed',
      'additionalComments',
      'deleted',
      ...this.getQuestionOrder(14)
    ];
  }

  private getQuestionOrder(numberOfQuestions: number): string[] {
    const questionOrder: string[] = [];
    for (let i = 1; i <= numberOfQuestions; i++) {
      questionOrder.push(`question${i}`);
    }
    return questionOrder;
  }

  private createYoungQuestions(): any[] {
    return this.createQuestions(29, 'registration.young.question');
  }

  private createAdultQuestions(): any[] {
    return this.createQuestions(19, 'registration.adult.question');
  }

  private createStaffQuestions(): any[] {
    return this.createQuestions(14, 'registration.staff.question');
  }

  private createQuestions(numberOfQuestions: number, translationKeyPrefix: string): any[] {
    const keyPrefix = 'question';
    const allQuestions: ExcelQuestion[] = [];
    for (let i = 1; i <= numberOfQuestions; i++) {
      allQuestions.push(new ExcelQuestion(keyPrefix + i, this.translateService.get(translationKeyPrefix + i)));
    }
    return allQuestions;
  }

  private getQuestionValueTranslation(value: string, question: number, group: RegistrationGroup): string {
    switch (group) {
      case RegistrationGroup.YOUNG:
        return this.getTranslationRulesYoung(value, question);
      case RegistrationGroup.ADULT:
        return this.getTranslationRulesAdult(value, question);
      case RegistrationGroup.STAFF:
        return this.getTranslationRulesStaff(value, question);
      default:
        return value;
    }
  }

  private getCommonTranslation(value: string, fieldName: string): string {
    switch (fieldName) {
      case 'advancePayed':
        return this.findValueOfYesNo(value);
      case 'fullAmountPayed':
        return this.findValueOfYesNo(value);
      default:
        return value;
    }
  }

  private getTranslationRulesYoung(value: string, questionNumber: number): string {
    return value;
  }

  private getTranslationRulesAdult(value: string, questionNumber: number): string {
    return value;
  }

  private getTranslationRulesStaff(value: string, questionNumber: number): string {
    switch (questionNumber) {
      case 4:
        return this.findValueOfGenders(value);
      case 7:
        return this.findValueOfAreaOfServe(value);
      case 8:
        return this.findValueOfKnownLanguage(value);
      default:
        return value;
    }
  }

  private findValueOfAreaOfServe(keyValue: string): string {
    const selectItem = select_area_of_serve.find(item => item.value === keyValue);
    if (selectItem) {
      return this.translateService.get(selectItem.viewKey);
    } else {
      return keyValue;
    }
  }

  private findValueOfGenders(keyValue: string): string {
    const selectItem = select_genders.find(item => item.value === keyValue);
    if (selectItem) {
      return this.translateService.get(selectItem.viewKey);
    } else {
      return keyValue;
    }
  }

  private findValueOfKnownLanguage(keyValue: string): string {
    const selectItem = select_known_languages.find(item => item.value === keyValue);
    if (selectItem) {
      return this.translateService.get(selectItem.viewKey);
    } else {
      return keyValue;
    }
  }

  private findValueOfYesNo(keyValue: string): string {
    const selectItem = select_yes_no.find(item => item.value === keyValue);
    if (selectItem) {
      return this.translateService.get(selectItem.viewKey);
    } else {
      return keyValue;
    }
  }

}
