import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { ChartService } from './service/chart.service';
import { ConnectionPointService } from '../connection-points/service/connection-point.service';
import { ContractService } from '../contracts/service/contract.service';
import { BusinessPartnerService } from '../business-partners/service/business-partner.service';
import { SensorService } from '../sensors/service/sensor.service';



interface SensorCounts {
  [key: string]: { access: number, in: number, out: number };
}



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private service: ChartService,
    private contractService: ContractService,
    private connectionPointService: ConnectionPointService,
    private businesspartnerService: BusinessPartnerService,
    private sensorService: SensorService) {}


  tenants: string[] = [];
  selectedTenant: string = '';

  chartdata: { tenant: string, count: number }[] = [];
  labeldata: string[] = [];
  realdata: number[] = [];
  colordata: string[] = [];

  dailyLabels: string[] = [];
  dailyData: number[] = [];
  monthlyLabels: string[] = [];
  monthlyData: number[] = [];
  connectionCount: number = 0;
  numberOfSuppliers: number = 0;
  numberOfConsumers: number = 0;
  numberOfFacilities: number = 0;
  numberOfValidContracts : number = 0;
  consumers: Set<string> = new Set<string>();
  suppliers: Set<string> = new Set<string>();

  trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    this.loadChartData();
    this.loadConnectionPointData();
    this.loadTenants();
    this.getBarChart();
  }


  loadTenants(): void {
    this.service.getTenants().subscribe(
      (tenants: string[]) => {
        this.tenants = tenants;
      },
      (error) => {
        console.error('Error fetching tenants:', error);
      }
    );
  }

  Stats() : void {
    this.numberOfSuppliers = 0;
    this.numberOfConsumers = 0;
    this.numberOfFacilities = 0;
    this.numberOfValidContracts = 0;
    this.consumers.clear();
    this.suppliers.clear();
    const searchParams = { tenantName: this.selectedTenant };
    this.connectionPointService.searchConnectionPoints(searchParams, 10, 0, 'tenantName').subscribe(page => {
      const connectionPoints = page.content.filter(cp => cp.tenantName === this.selectedTenant);
      connectionPoints.forEach(cp => {
        if (cp.type === 'FACILITY') {
          this.numberOfFacilities++;

          if (!this.consumers.has(cp.businessPartnerId)) {
            this.consumers.add(cp.businessPartnerId);
          }

        }
        else {
          if (!this.suppliers.has(cp.businessPartnerId)) {
            this.suppliers.add(cp.businessPartnerId);
          }
        }
      });
      this.numberOfConsumers= this.consumers.size;
      this.numberOfSuppliers=this.suppliers.size;

    });

    this.contractService.searchContracts({}, 10, 0, 'contractStart').subscribe(page => {
      const contracts = page.content;
      const currentDate = new Date(); 
      contracts.forEach(c => {
        this.businesspartnerService.searchBusinessPartners({}, 10, 0, 'name').subscribe(page => {
          const businessPartners = page.content.filter(bp => bp.tenantId === this.selectedTenant);
          businessPartners.forEach(bp => { 
            if (c.supplierId===bp.id) {
              if (new Date(c.contractEnd!) > new Date(c.contractStart) && new Date(c.contractEnd!) > currentDate) {
                this.numberOfValidContracts++;
              }
            }
          });
        });
      });
    });
  }



  getBarChart() {
    const searchParams = { type: 'FACILITY' };
    this.connectionPointService.searchConnectionPoints(searchParams, 10, 0, 'tenantName').subscribe(page => {
      const connectionPoints = page.content;
  
      const sensorCounts: SensorCounts = {};
  
      connectionPoints.forEach(point => {
        this.sensorService.searchSensors({ connectionPointId: point.id }, 10, 0, 'serialNumber').subscribe(sensorPage => {
          const sensors = sensorPage.content.filter(s => s.connectionPointId === point.id);
  
          if (!sensorCounts[point.name]) {
            sensorCounts[point.name] = { access: 0, in: 0, out: 0 };
          }
  
          sensors.forEach(sensor => {
            if (sensor.direction === 'ACCESS') {
              sensorCounts[point.name].access++;
            } else if (sensor.direction === 'IN') {
              sensorCounts[point.name].in++;
            } else if (sensor.direction === 'OUT') {
              sensorCounts[point.name].out++;
            }
          });
  
  
          // Render the chart after processing all sensor data
          this.renderSensorBarChart(sensorCounts);
        });
      });
    });
  }
  
  
  renderSensorBarChart(sensorCounts: SensorCounts) {
    const labels = Object.keys(sensorCounts);
  
    const accessData = labels.map(label => sensorCounts[label].access);
    const inData = labels.map(label => sensorCounts[label].in);
    const outData = labels.map(label => sensorCounts[label].out);
  
    const datasets = [
      {
        label: 'Access',
        data: accessData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'Stack 0'
      },
      {
        label: 'In',
        data: inData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        stack: 'Stack 0'
      },
      {
        label: 'Out',
        data: outData,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        stack: 'Stack 0'
      }
    ];
  
    this.destroyChart('barchart');
    this.renderbarchart(labels, datasets);
  }
  
  destroyChart(chartId: string) {
    const chartInstance = Chart.getChart(chartId);
    if (chartInstance) {
      chartInstance.destroy();
    }
  }
  
  renderbarchart(labeldata: any, datasets: any) {
    this.RenderChart(labeldata, datasets, 'barchart', 'bar');
  }
  
  RenderChart(labeldata: string[], datasets: any[], chartid: string, charttype: any) {
    new Chart(chartid, {
      type: charttype,
      data: {
        labels: labeldata,
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  loadChartData() {
    this.service.getTenantsWithFacilities().subscribe(tenants => {
      tenants.forEach((tenant) => {
        this.chartdata.push({ tenant: tenant.tenantName, count: tenant.connectionCount });
      });

      this.chartdata.forEach(data => {
        this.labeldata.push(data.tenant);
        this.realdata.push(data.count);
        this.colordata.push(this.getRandomColor());
      });

      this.renderPieChart(this.labeldata, this.realdata, this.colordata);
    });
  }

  loadConnectionPointData() {
    const searchParams = { type: 'FACILITY' };
    this.service.searchConnectionPoints(searchParams, 10, 0, 'tenantName').subscribe(page => {
      const connectionPoints = page.content;
      this.connectionCount = connectionPoints.length;

      const dailyCountMap = new Map<string, number>();
      const monthlyCountMap = new Map<string, number>();

      const currentYear = new Date().getFullYear();

      connectionPoints.forEach(point => {
        const activatedDate = new Date(point.activatedAt);
        const year = activatedDate.getFullYear();
        const day = activatedDate.toISOString().split('T')[0];
        const month = `${activatedDate.getFullYear()}-${(activatedDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
        // Count daily
        if (dailyCountMap.has(day)) {
          dailyCountMap.set(day, dailyCountMap.get(day)! + 1);
        } else {
          dailyCountMap.set(day, 1);
        }
      
        if (year === currentYear) {
          // Count monthly
          if (monthlyCountMap.has(month)) {
            monthlyCountMap.set(month, monthlyCountMap.get(month)! + 1);
          } else {
            monthlyCountMap.set(month, 1);
          }
        }
      });
      
      this.dailyLabels = Array.from(dailyCountMap.keys());
      this.dailyData = Array.from(dailyCountMap.values());
      this.monthlyLabels = Array.from(monthlyCountMap.keys());
      this.monthlyData = Array.from(monthlyCountMap.values());
      
      this.updateChart();
      
    });
  }

  updateChart() {
    const period = this.trafficRadioGroup.value.trafficRadio;
    if (period === 'Day') {
      this.renderLineChart(this.dailyLabels, this.dailyData);
    } else {
      this.renderLineChart(this.monthlyLabels, this.monthlyData);
    }
  }
  

  renderLineChart(labels: string[], data: number[]) {
    
    const existingChart = Chart.getChart('linechart');
    if (existingChart) {
      existingChart.destroy();
    }
    
    new Chart('linechart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Facilities',
          data: data,
          borderColor: '#42A5F5',
          fill: false
        }]
      }
    });
  }
  
  

  renderChart(labeldata: string[], valuedata: number[], colordata: string[], chartid: string, charttype: any) {
    new Chart(chartid, {
      type: charttype,
      data: {
        labels: labeldata,
        datasets: [{
          label: 'Number of Facilities per Tenant',
          data: valuedata,
          backgroundColor: colordata,
        }]
      }
    });
  }


  renderPieChart(labeldata: string[], valuedata: number[], colordata: string[]) {
    this.renderChart(labeldata, valuedata, colordata, 'piechart', 'pie');
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.updateChart();
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }



}
