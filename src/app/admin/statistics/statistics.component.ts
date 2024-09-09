import {Component, OnDestroy} from '@angular/core';
import {RegistrationYoungData} from "../../_models/registration/registration-young-data";
import {RegistrationAdultData} from "../../_models/registration/registration-adult-data";
import {Registration1318DaoService} from "../../_services/database/registration-13-18-dao.service";
import {Registration1926DaoService} from "../../_services/database/registration-19-26-dao.service";
import {AccessRoleService} from "../../_services/auth/access-role.service";
import {AccessPage} from "../../_services/auth/access-page";
import {Subscription} from "rxjs";
import {Chart, registerables} from 'chart.js';
import 'chartjs-adapter-date-fns';
import {CustomTranslateService} from "../../_services/translate/custom-translate.service";
import {DateTime} from "luxon";
import {DateService} from "../../_services/util/date.service";
import {RegistrationStaffData} from "../../_models/registration/registration-staff-data";
import {RegistrationStaffDaoService} from "../../_services/database/registration-staff-dao.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnDestroy {
  protected youngRegistrationData: RegistrationYoungData[];
  protected adultRegistrationData: RegistrationAdultData[];
  protected stuffRegistrationData: RegistrationStaffData[];
  protected youngRegistrationDataSubscription: Subscription;
  protected adultRegistrationDataSubscription: Subscription;
  protected stuffRegistrationDataSubscription: Subscription;
  protected registrationChart: Chart | undefined;
  protected registrationChartCumulativeSum: Chart | undefined;

  constructor(
    private registrationYoungService: Registration1318DaoService,
    private registrationAdultService: Registration1926DaoService,
    private registrationStaffDaoService: RegistrationStaffDaoService,
    private accessService: AccessRoleService,
    private translateService: CustomTranslateService
  ) {
    this.accessService.isAuthorizedToSeePage(AccessPage.STATISTICS)
      .then((isAuthorized: boolean): void => {
        if (isAuthorized) {
          this.subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.youngRegistrationDataSubscription?.unsubscribe();
    this.adultRegistrationDataSubscription?.unsubscribe();
    this.stuffRegistrationDataSubscription?.unsubscribe();
    this.destroyCharts();
  }

  private destroyCharts(): void {
    this.registrationChart?.destroy();
    this.registrationChart = undefined;
    this.registrationChartCumulativeSum?.destroy();
    this.registrationChartCumulativeSum = undefined;
  }

  private subscribe(): void {
    this.youngRegistrationDataSubscription = this.registrationYoungService.getNotDeletedOnly().subscribe({
      next: (regData) => {
        this.youngRegistrationData = regData;
        if (this.areAllDataPresent()) {
          this.drawCharts();
        }
      }
    });
    this.adultRegistrationDataSubscription = this.registrationAdultService.getNotDeletedOnly().subscribe({
      next: (regData) => {
        this.adultRegistrationData = regData;
        if (this.areAllDataPresent()) {
          this.drawCharts();
        }
      }
    });
    this.stuffRegistrationDataSubscription = this.registrationStaffDaoService.getNotDeletedOnly().subscribe({
      next: (regData) => {
        this.stuffRegistrationData = regData;
        if (this.areAllDataPresent()) {
          this.drawCharts();
        }
      }
    });
  }

  private areAllDataPresent(): boolean {
    return !!(this.youngRegistrationData && this.adultRegistrationData && this.stuffRegistrationData);
  }

  private drawCharts(): void {
    let color1: string = '#83cfcb';
    let color2: string = '#e04036';
    let color3: string = '#a796ca';
    this.registrationChart = this.createOrUpdateChart(
      this.youngRegistrationData.map(elem => elem.creationTimestamp),
      this.adultRegistrationData.map(elem => elem.creationTimestamp),
      this.stuffRegistrationData.map(elem => elem.creationTimestamp),
      'registrationChart',
      this.translateService.get('bk.registration.registerTitleYoung'),
      this.translateService.get('bk.registration.registerTitleAdult'),
      this.translateService.get('bk.registration.registerTitleStaff'),
      color1, color2, color3, false
    );
    this.registrationChartCumulativeSum = this.createOrUpdateChart(
      this.youngRegistrationData.map(elem => elem.creationTimestamp),
      this.adultRegistrationData.map(elem => elem.creationTimestamp),
      this.stuffRegistrationData.map(elem => elem.creationTimestamp),
      'registrationChartCumulativeSum',
      this.translateService.get('bk.registration.registerTitleYoung'),
      this.translateService.get('bk.registration.registerTitleAdult'),
      this.translateService.get('bk.registration.registerTitleStaff'),
      color1, color2, color3, true
    );
  }

  private createOrUpdateChart(
    timestamps1: string[], timestamps2: string[], timestamps3: string[],
    elementToDrawId: string,
    label1: string, label2: string, label3: string,
    color1: string, color2: string, color3: string,
    showCumulativeSum: boolean
  ): Chart {
    Chart.register(...registerables);

    const dateCountMap1: { [key: string]: number } = {};
    const dateCountMap2: { [key: string]: number } = {};
    const dateCountMap3: { [key: string]: number } = {};

    // Count registrations per date for data source 1
    timestamps1.forEach(data => {
      const date = DateTime.fromISO(data).setZone(DateService.timeZone).toISODate();
      if (date === null) {
        throw new Error("Date cannot be null! Date to parse: " + data);
      }
      if (dateCountMap1[date]) {
        dateCountMap1[date]++;
      } else {
        dateCountMap1[date] = 1;
      }
    });

    // Count registrations per date for data source 2
    timestamps2.forEach(data => {
      const date = DateTime.fromISO(data).setZone(DateService.timeZone).toISODate();
      if (date === null) {
        throw new Error("Date cannot be null! Date to parse: " + data);
      }
      if (dateCountMap2[date]) {
        dateCountMap2[date]++;
      } else {
        dateCountMap2[date] = 1;
      }
    });

    // Count registrations per date for data source 3
    timestamps3.forEach(data => {
      const date = DateTime.fromISO(data).setZone(DateService.timeZone).toISODate();
      if (date === null) {
        throw new Error("Date cannot be null! Date to parse: " + data);
      }
      if (dateCountMap3[date]) {
        dateCountMap3[date]++;
      } else {
        dateCountMap3[date] = 1;
      }
    });

    // Combine all dates from both sources and sort them
    const allDates = Array.from(new Set([...Object.keys(dateCountMap1), ...Object.keys(dateCountMap2), ...Object.keys(dateCountMap3)]));
    const sortedDates = allDates.sort((a, b) => DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis());

    // Prepare chart data for data source 1
    const chartData1 = sortedDates.map(date => dateCountMap1[date] || 0);

    // Prepare chart data for data source 2
    const chartData2 = sortedDates.map(date => dateCountMap2[date] || 0);

    // Prepare chart data for data source 3
    const chartData3 = sortedDates.map(date => dateCountMap3[date] || 0);

    // Calculate cumulative sum for data source 1 if required
    let cumulativeData1 = chartData1;
    if (showCumulativeSum) {
      let cumulativeSum1 = 0;
      cumulativeData1 = chartData1.map(count => cumulativeSum1 += count);
    }

    // Calculate cumulative sum for data source 2 if required
    let cumulativeData2 = chartData2;
    if (showCumulativeSum) {
      let cumulativeSum2 = 0;
      cumulativeData2 = chartData2.map(count => cumulativeSum2 += count);
    }

    // Calculate cumulative sum for data source 2 if required
    let cumulativeData3 = chartData3;
    if (showCumulativeSum) {
      let cumulativeSum3 = 0;
      cumulativeData3 = chartData3.map(count => cumulativeSum3 += count);
    }

    const ctx = document.getElementById(elementToDrawId) as HTMLCanvasElement;

    let data = {
      labels: sortedDates,
      datasets: [
        {
          label: label1,
          data: showCumulativeSum ? cumulativeData1 : chartData1,
          borderColor: color1,
          backgroundColor: color1,
          fill: false,
        },
        {
          label: label2,
          data: showCumulativeSum ? cumulativeData2 : chartData2,
          borderColor: color2,
          backgroundColor: color2,
          fill: false,
        },
        {
          label: label3,
          data: showCumulativeSum ? cumulativeData3 : chartData3,
          borderColor: color3,
          backgroundColor: color3,
          fill: false,
        }
      ]
    };

    let chart = showCumulativeSum ? this.registrationChartCumulativeSum : this.registrationChart;
    if (chart) {
      chart.data = data;
      chart.update();
      return chart;
    } else {
      return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              }
            },
            y: {
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }

}
