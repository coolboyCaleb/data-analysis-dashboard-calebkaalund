import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, Legend 
} from 'recharts';
import { DataRow } from '@/types/data';
import { getDataSummary } from '@/utils/dataAnalysis';

interface ChartSectionProps {
  data: DataRow[];
  showAll?: boolean;
  interactive?: boolean;
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const ChartSection = ({ data, showAll = false, interactive = false }: ChartSectionProps) => {
  const summary = useMemo(() => getDataSummary(data), [data]);
  
  const numericColumns = useMemo(() => {
    return Object.entries(summary.columnTypes)
      .filter(([_, type]) => type === 'numeric')
      .map(([column]) => column);
  }, [summary]);

  // Interactive state
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie" | "scatter">("bar");

  // Set default selection
  useEffect(() => {
    if (numericColumns.length > 0 && !selectedColumn) {
      setSelectedColumn(numericColumns[0]);
    }
  }, [numericColumns, selectedColumn]);

  const chartData = useMemo(() => {
    if (numericColumns.length === 0) return [];
    
    return data.slice(0, 50).map((row, index) => {
      const item: any = { name: `Row ${index + 1}` };
      // Try to find a text column to use as a label
      const labelCol = Object.keys(row).find(key => isNaN(Number(row[key])));
      if (labelCol) {
        item.name = String(row[labelCol]).substring(0, 15); // Truncate long labels
      }

      numericColumns.forEach(col => {
        const val = Number(row[col]);
        item[col] = isNaN(val) ? 0 : val;
      });
      return item;
    });
  }, [data, numericColumns]);

  if (numericColumns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No numeric columns found for visualization. Upload data with numeric values to see charts.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render a single interactive chart
  if (interactive) {
    const renderInteractiveChart = () => {
      if (!selectedColumn) return null;

      switch (chartType) {
        case 'bar':
          return (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedColumn} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          );
        case 'line':
          return (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={selectedColumn} stroke={COLORS[1]} strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          );
        case 'area':
          return (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={selectedColumn} stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.3} />
            </AreaChart>
          );
        case 'pie':
          return (
            <PieChart>
              <Pie
                data={chartData.slice(0, 10)}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey={selectedColumn}
                nameKey="name"
                label
              >
                {chartData.slice(0, 10).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          );
        case 'scatter':
           // For scatter, we ideally need 2 columns. If only 1 selected, we can use index vs value, 
           // or we could add a second selector. For simplicity, let's use Index vs Value if only 1 is picked,
           // or maybe just disable scatter if we want to be strict. 
           // Let's stick to the SimpleChart behavior: Index vs Value.
           return (
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="category" dataKey="name" name="Item" />
              <YAxis type="number" dataKey={selectedColumn} name={selectedColumn} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={selectedColumn} data={chartData} fill={COLORS[3]} />
            </ScatterChart>
          );
        default:
          return null;
      }
    };

    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Interactive Visualization</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Data Column</label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
              <div className="flex flex-wrap gap-2">
                {["bar", "line", "area", "pie", "scatter"].map((type) => (
                  <Button
                    key={type}
                    variant={chartType === type ? "default" : "outline"}
                    onClick={() => setChartType(type as any)}
                    size="sm"
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4 border rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              {renderInteractiveChart()!}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Non-interactive "Overview" mode (Grid of charts)
  const charts = showAll ? [
    { type: 'bar', title: 'Bar Chart' },
    { type: 'line', title: 'Line Chart' },
    { type: 'area', title: 'Area Chart' },
    { type: 'pie', title: 'Distribution' },
    { type: 'scatter', title: 'Scatter Plot' }
  ] : [{ type: 'bar', title: 'Data Overview' }];

  const renderStaticChart = (type: string) => {
     // Use the first few numeric columns for static charts
     const displayColumns = numericColumns.slice(0, showAll ? 10 : 2);
     
     switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {displayColumns.map((column, idx) => (
              <Bar key={column} dataKey={column} fill={COLORS[idx % COLORS.length]} />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {displayColumns.map((column, idx) => (
              <Line key={column} type="monotone" dataKey={column} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {displayColumns.map((column, idx) => (
              <Area key={column} type="monotone" dataKey={column} stroke={COLORS[idx % COLORS.length]} fill={COLORS[idx % COLORS.length]} fillOpacity={0.3} />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData.slice(0, 6)}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey={displayColumns[0]}
              nameKey="name"
              label
            >
              {chartData.slice(0, 6).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'scatter':
        if (displayColumns.length < 2) return <div className="flex items-center justify-center h-full text-gray-400">Need 2+ numeric columns</div>;
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey={displayColumns[0]} name={displayColumns[0]} />
            <YAxis type="number" dataKey={displayColumns[1]} name={displayColumns[1]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name={`${displayColumns[0]} vs ${displayColumns[1]}`} data={chartData} fill={COLORS[0]} />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${showAll ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-0' : ''}`}>
      {charts.map(({ type, title }) => (
        <Card key={type} className="w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {renderStaticChart(type)!}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChartSection;
