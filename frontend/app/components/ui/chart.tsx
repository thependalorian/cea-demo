/**
 * Chart Component - ACT Climate Economy Assistant
 * 
 * Purpose: Data visualization with consistent styling
 * Location: /app/components/ui/chart.tsx
 * Used by: Dashboard, analytics, and reporting pages
 * 
 * Features:
 * - Massachusetts climate branding
 * - Responsive design
 * - Accessibility features
 * - Apple-inspired animations
 * - Multiple chart types (Line, Bar, Area, Pie)
 */

import * as React from "react"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  Legend,
  TooltipProps
} from "recharts"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Chart wrapper styling
const chartContainerVariants = cva(
  "w-full rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white border border-sand-gray-200",
        glass: "glass-card",
        outline: "border border-sand-gray-200 bg-transparent",
        filled: "bg-sand-gray-50",
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
      },
      elevation: {
        none: "",
        low: "shadow-sm",
        default: "shadow-md",
        high: "shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      elevation: "default",
    },
  }
)

// Climate-themed color palette for charts
export const chartColors = {
  primary: "#B2DE26", // spring-green-500
  secondary: "#394816", // moss-green-700
  tertiary: "#001818", // midnight-forest-900
  accent1: "#0EA5E9", // seafoam-blue-500
  accent2: "#7E6551", // earth-brown-600
  accent3: "#EAB308", // solar-yellow-500
  accent4: "#3B82F6", // wind-blue-500
  // Lighter variants for fills
  primaryLight: "#E2F2A7", // spring-green-200
  secondaryLight: "#8DA046", // moss-green-400
  tertiaryLight: "#003F3F", // midnight-forest-700
  accent1Light: "#7DD3FC", // seafoam-blue-300
  accent2Light: "#B89F8E", // earth-brown-400
  accent3Light: "#FDE68A", // solar-yellow-200
  accent4Light: "#93C5FD", // wind-blue-300
  // Gradients
  springGradient: ["#B2DE26", "#8DA046"],
  mossGradient: ["#394816", "#8DA046"],
  oceanGradient: ["#0EA5E9", "#7DD3FC"],
}

// Custom tooltip component with climate branding
const CustomTooltip = ({ active, payload, label, ...props }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-sand-gray-200 rounded-md shadow-lg text-sm">
        <p className="font-medium text-midnight-forest-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sand-gray-600">{entry.name}: </span>
            <span className="font-medium text-midnight-forest-900">
              {typeof entry.value === 'number' 
                ? entry.payload.formatter 
                  ? entry.payload.formatter(entry.value) 
                  : entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Base chart container component
export interface ChartContainerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartContainerVariants> {
  title?: string
  description?: string
  height?: number | string
  width?: number | string
  loading?: boolean
  error?: string
  emptyMessage?: string
  hasData?: boolean
  legendPosition?: 'top' | 'right' | 'bottom' | 'left'
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ 
    className, 
    variant, 
    padding, 
    elevation,
    title,
    description,
    height = 300,
    width = "100%",
    loading = false,
    error,
    emptyMessage = "No data available",
    hasData = true,
    legendPosition = 'bottom',
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chartContainerVariants({ variant, padding, elevation }), className)}
        {...props}
      >
        {/* Chart header */}
        {(title || description) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-medium text-midnight-forest-900">{title}</h3>}
            {description && <p className="text-sm text-sand-gray-600 mt-1">{description}</p>}
          </div>
        )}
        
        {/* Chart content */}
        <div 
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width,
          }}
          className="relative"
        >
          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="animate-pulse-subtle flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-spring-green-200 animate-spin" />
                <span className="mt-2 text-sm text-sand-gray-600">Loading data...</span>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center p-4">
                <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">!</span>
                </div>
                <p className="text-red-600 font-medium">Error loading chart</p>
                <p className="text-sm text-sand-gray-600 mt-1">{error}</p>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {!loading && !error && !hasData && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center p-4">
                <div className="h-10 w-10 rounded-full bg-sand-gray-100 text-sand-gray-500 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📊</span>
                </div>
                <p className="text-sand-gray-600">{emptyMessage}</p>
              </div>
            </div>
          )}
          
          {/* Chart content */}
          {children}
        </div>
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// Line Chart Component
export interface LineChartProps extends Omit<ChartContainerProps, 'children'> {
  data: unknown[]
  lines: {
    dataKey: string
    name?: string
    color?: string
    strokeWidth?: number
    dot?: boolean | object
    formatter?: (value: number) => string
  }[]
  xAxisDataKey: string
  xAxisLabel?: string
  yAxisLabel?: string
  grid?: boolean
  animation?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  tickFormatter?: (value: unknown) => string
  yAxisTickFormatter?: (value: unknown) => string
  xAxisTickFormatter?: (value: unknown) => string
}

const LineChartComponent = ({
  data,
  lines,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  grid = true,
  animation = true,
  showTooltip = true,
  showLegend = true,
  tickFormatter,
  yAxisTickFormatter,
  xAxisTickFormatter,
  legendPosition = 'bottom',
  ...props
}: LineChartProps) => {
  const hasData = data && data.length > 0 && lines && lines.length > 0

  return (
    <ChartContainer {...props} hasData={hasData} legendPosition={legendPosition}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis 
            dataKey={xAxisDataKey} 
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
            tick={{ fill: '#4B5563', fontSize: 12 }}
            tickFormatter={xAxisTickFormatter || tickFormatter}
            stroke="#9CA3AF"
          />
          <YAxis 
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            tick={{ fill: '#4B5563', fontSize: 12 }}
            tickFormatter={yAxisTickFormatter || tickFormatter}
            stroke="#9CA3AF"
          />
          {showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
          {showLegend && <Legend 
            verticalAlign={legendPosition === 'bottom' || legendPosition === 'top' ? legendPosition : 'bottom'} 
            align={legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'center'}
            wrapperStyle={{ paddingTop: 10 }}
          />}
          {lines.map((line, index) => (
            <Line
              key={`line-${line.dataKey}`}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || chartColors[`accent${(index % 4) + 1}` as keyof typeof chartColors] || chartColors.primary}
              strokeWidth={line.strokeWidth || 2}
              dot={line.dot === false ? false : line.dot || { r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={animation}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Bar Chart Component
export interface BarChartProps extends Omit<ChartContainerProps, 'children'> {
  data: unknown[]
  bars: {
    dataKey: string
    name?: string
    color?: string
    formatter?: (value: number) => string
    stackId?: string | number
  }[]
  xAxisDataKey: string
  xAxisLabel?: string
  yAxisLabel?: string
  grid?: boolean
  animation?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  layout?: 'vertical' | 'horizontal'
  tickFormatter?: (value: unknown) => string
  yAxisTickFormatter?: (value: unknown) => string
  xAxisTickFormatter?: (value: unknown) => string
}

const BarChartComponent = ({
  data,
  bars,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  grid = true,
  animation = true,
  showTooltip = true,
  showLegend = true,
  layout = 'horizontal',
  tickFormatter,
  yAxisTickFormatter,
  xAxisTickFormatter,
  legendPosition = 'bottom',
  ...props
}: BarChartProps) => {
  const hasData = data && data.length > 0 && bars && bars.length > 0

  return (
    <ChartContainer {...props} hasData={hasData} legendPosition={legendPosition}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis 
            dataKey={layout === 'horizontal' ? xAxisDataKey : undefined}
            type={layout === 'horizontal' ? 'category' : 'number'}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
            tick={{ fill: '#4B5563', fontSize: 12 }}
            tickFormatter={xAxisTickFormatter || tickFormatter}
            stroke="#9CA3AF"
          />
          <YAxis 
            dataKey={layout === 'vertical' ? xAxisDataKey : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            tick={{ fill: '#4B5563', fontSize: 12 }}
            tickFormatter={yAxisTickFormatter || tickFormatter}
            stroke="#9CA3AF"
          />
          {showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
          {showLegend && <Legend 
            verticalAlign={legendPosition === 'bottom' || legendPosition === 'top' ? legendPosition : 'bottom'} 
            align={legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'center'}
            wrapperStyle={{ paddingTop: 10 }}
          />}
          {bars.map((bar, index) => (
            <Bar
              key={`bar-${bar.dataKey}`}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color || chartColors[`accent${(index % 4) + 1}` as keyof typeof chartColors] || chartColors.primary}
              stackId={bar.stackId}
              isAnimationActive={animation}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Area Chart Component
export interface AreaChartProps extends Omit<ChartContainerProps, 'children'> {
  data: unknown[]
  areas: {
    dataKey: string
    name?: string
    color?: string
    fillOpacity?: number
    formatter?: (value: number) => string
    stackId?: string | number
  }[]
  xAxisDataKey: string
  xAxisLabel?: string
  yAxisLabel?: string
  grid?: boolean
  animation?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  tickFormatter?: (value: unknown) => string
  yAxisTickFormatter?: (value: unknown) => string
  xAxisTickFormatter?: (value: unknown) => string
}

const AreaChartComponent = ({
  data,
  areas,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  grid = true,
  animation = true,
  showTooltip = true,
  showLegend = true,
  tickFormatter,
  yAxisTickFormatter,
  xAxisTickFormatter,
  legendPosition = 'bottom',
  ...props
}: AreaChartProps) => {
  const hasData = data && data.length > 0 && areas && areas.length > 0

  return (
    <ChartContainer {...props} hasData={hasData} legendPosition={legendPosition}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis 
            dataKey={xAxisDataKey} 
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
            tick={{ fill: '#4B5563', fontSize: 12 }}
            tickFormatter={xAxisTickFormatter || tickFormatter}
            stroke="#9CA3AF"
          />
          <YAxis 
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            tick={{ fill: '#4B5563', fontSize: 12 }}
            tickFormatter={yAxisTickFormatter || tickFormatter}
            stroke="#9CA3AF"
          />
          {showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
          {showLegend && <Legend 
            verticalAlign={legendPosition === 'bottom' || legendPosition === 'top' ? legendPosition : 'bottom'} 
            align={legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'center'}
            wrapperStyle={{ paddingTop: 10 }}
          />}
          {areas.map((area, index) => (
            <Area
              key={`area-${area.dataKey}`}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name || area.dataKey}
              stroke={area.color || chartColors[`accent${(index % 4) + 1}` as keyof typeof chartColors] || chartColors.primary}
              fill={area.color || chartColors[`accent${(index % 4) + 1}Light` as keyof typeof chartColors] || chartColors.primaryLight}
              fillOpacity={area.fillOpacity || 0.6}
              stackId={area.stackId}
              isAnimationActive={animation}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Pie Chart Component
export interface PieChartProps extends Omit<ChartContainerProps, 'children'> {
  data: Array<{
    name: string
    value: number
    color?: string
    formatter?: (value: number) => string
  }>
  dataKey?: string
  nameKey?: string
  innerRadius?: number | string
  outerRadius?: number | string
  animation?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  valueFormatter?: (value: number) => string
}

const PieChartComponent = ({
  data,
  dataKey = "value",
  nameKey = "name",
  innerRadius = 0,
  outerRadius = "80%",
  animation = true,
  showTooltip = true,
  showLegend = true,
  valueFormatter,
  legendPosition = 'bottom',
  ...props
}: PieChartProps) => {
  const hasData = data && data.length > 0
  
  // Calculate inner radius as percentage if outer radius is percentage
  let calculatedInnerRadius: number | string = innerRadius
  if (typeof innerRadius === 'number' && typeof outerRadius === 'string' && outerRadius.endsWith('%')) {
    const percentage = parseInt(outerRadius, 10) / 100
    calculatedInnerRadius = `${Math.round(percentage * (innerRadius as number))}%`
  }

  return (
    <ChartContainer {...props} hasData={hasData} legendPosition={legendPosition}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={calculatedInnerRadius}
            outerRadius={outerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
            isAnimationActive={animation}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || chartColors[`accent${(index % 4) + 1}` as keyof typeof chartColors] || chartColors.primary} 
              />
            ))}
          </Pie>
          {showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
          {showLegend && <Legend 
            verticalAlign={legendPosition === 'bottom' || legendPosition === 'top' ? legendPosition : 'bottom'} 
            align={legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'center'}
            wrapperStyle={{ paddingTop: 10 }}
          />}
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export { 
  ChartContainer,
  LineChartComponent as LineChart,
  BarChartComponent as BarChart,
  AreaChartComponent as AreaChart,
  PieChartComponent as PieChart
} 