import type { ChartData, ChartOptions } from 'chart.js'

export interface ChartPoint {
  x: number
  y: number
  label?: string
}

export interface ChartDataset {
  label: string
  data: ChartPoint[] | number[]
  borderColor?: string
  backgroundColor?: string
  fill?: boolean | string
  tension?: number
  pointRadius?: number
  borderWidth?: number
}

export interface BaseChartProps {
  chartData: ChartData
  options?: ChartOptions
  width?: number
  height?: number
}

export interface LineChartProps extends BaseChartProps {
  chartData: ChartData<'line'>
  options?: ChartOptions<'line'>
}

export interface AreaChartProps extends BaseChartProps {
  chartData: ChartData<'line'>
  options?: ChartOptions<'line'>
  gradient?: boolean
}

export interface ProjectionData {
  ages: number[]
  values: number[]
  targetValue: number
  currentValue: number
}

export interface MortgageBalanceData {
  months: number[]
  standardBalance: number[]
  acceleratedBalance: number[]
  monthsSaved: number
  interestSaved: number
}

export interface InvestmentComparisonData {
  months: number[]
  mortgageValue: number[]
  investmentValue: number[]
  crossoverMonth?: number
}