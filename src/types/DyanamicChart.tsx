export interface DynamicChartProps {
  title: string;
  primaryEndpoint: () => Promise<any[]>;
  secondaryEndpoint?: () => Promise<any[]>;
  groupByField: string;
  valueField: string;
  labelField?: string;
  chartType: 'pie' | 'bar' | 'line';
}
