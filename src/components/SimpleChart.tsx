import React, { useState, useMemo, useEffect } from "react";
import {
   BarChart,
   Bar,
   LineChart,
   Line,
   PieChart,
   Pie,
   Cell,
   ScatterChart,
   Scatter,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   AreaChart,
   Area,
} from "recharts";
import { datasets } from "@/utils/chartData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataRow } from "@/types/data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface SimpleChartProps {
  data?: DataRow[];
  className?: string;
}

const SimpleChart = ({ data, className }: SimpleChartProps) => {
   const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>("temperatures");
   const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "scatter" | "area">("bar");

   // Determine available datasets (static + dynamic columns from props)
   const availableDatasets = useMemo(() => {
      const options = [
         { value: "temperatures", label: "Temperatures (°F)" },
         { value: "testScores", label: "Test Scores" },
         { value: "salesFigures", label: "Sales Figures ($)" },
      ];

      if (data && data.length > 0) {
         const firstRow = data[0];
         const numericKeys = Object.keys(firstRow).filter(key => {
            const val = firstRow[key];
            return typeof val === 'number' || (!isNaN(Number(val)) && val !== '');
         });

         if (numericKeys.length > 0) {
            return numericKeys.map(key => ({ value: key, label: key }));
         }
      }
      return options;
   }, [data]);

   // Set initial selection if data is provided
   useEffect(() => {
      if (data && data.length > 0 && availableDatasets.length > 0) {
         // If the currently selected key isn't in the new available datasets, switch to the first one
         const currentExists = availableDatasets.some(d => d.value === selectedDatasetKey);
         if (!currentExists) {
            setSelectedDatasetKey(availableDatasets[0].value);
         }
      }
   }, [data, availableDatasets, selectedDatasetKey]);

   // Transform data for Recharts
   const chartData = useMemo(() => {
      // Handle dynamic data from props
      if (data && data.length > 0) {
         const column = selectedDatasetKey;
         // Check if the selected key exists in the data
         if (Object.keys(data[0]).includes(column)) {
             return data.slice(0, 50).map((row, index) => { // Limit to 50 rows for performance
                const val = row[column];
                const numVal = typeof val === 'number' ? val : Number(val);
                return {
                   name: `Row ${index + 1}`,
                   index: index + 1,
                   value: isNaN(numVal) ? 0 : numVal,
                   x: index + 1,
                   y: isNaN(numVal) ? 0 : numVal,
                };
             });
         }
      }

      // Fallback to static datasets
      const rawData = datasets[selectedDatasetKey as keyof typeof datasets];
      if (!rawData || rawData.length === 0) return [];
      
      return rawData.map((value, index) => ({
         name: `Item ${index + 1}`,
         index: index + 1,
         value: value,
         x: index + 1,
         y: value,
      }));
   }, [data, selectedDatasetKey]);

   const handleDatasetChange = (value: string) => {
      setSelectedDatasetKey(value);
   };

   if (chartData.length === 0) {
      return (
         <div className="p-4 text-red-500 bg-red-50 rounded-md">
            No data available for the selected dataset.
         </div>
      );
   }

   return (
      <Card className={`w-full shadow-lg ${className}`}>
         <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Data Visualization</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
               <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Data Source</label>
                  <Select value={selectedDatasetKey} onValueChange={handleDatasetChange}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select dataset" />
                     </SelectTrigger>
                     <SelectContent>
                        {availableDatasets.map(ds => (
                           <SelectItem key={ds.value} value={ds.value}>{ds.label}</SelectItem>
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
                  {chartType === "bar" ? (
                     <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                           contentStyle={{ backgroundColor: "#f3f4f6", borderRadius: "8px" }}
                           cursor={{ fill: "transparent" }}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" name={selectedDatasetKey} radius={[4, 4, 0, 0]} />
                     </BarChart>
                  ) : chartType === "line" ? (
                     <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                           contentStyle={{ backgroundColor: "#f3f4f6", borderRadius: "8px" }}
                        />
                        <Legend />
                        <Line
                           type="monotone"
                           dataKey="value"
                           stroke="#10b981"
                           strokeWidth={3}
                           activeDot={{ r: 8 }}
                           name={selectedDatasetKey}
                        />
                     </LineChart>
                  ) : chartType === "area" ? (
                     <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                           contentStyle={{ backgroundColor: "#f3f4f6", borderRadius: "8px" }}
                        />
                        <Legend />
                        <Area
                           type="monotone"
                           dataKey="value"
                           stroke="#8884d8"
                           fill="#8884d8"
                           name={selectedDatasetKey}
                        />
                     </AreaChart>
                  ) : chartType === "pie" ? (
                     <PieChart>
                        <Pie
                           data={chartData}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                           outerRadius={120}
                           fill="#8884d8"
                           dataKey="value"
                           nameKey="name"
                        >
                           {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                     </PieChart>
                  ) : (
                     <ScatterChart>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="Index" unit="" />
                        <YAxis type="number" dataKey="y" name="Value" unit="" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Legend />
                        <Scatter name={selectedDatasetKey} data={chartData} fill="#ff7300" />
                     </ScatterChart>
                  )}
               </ResponsiveContainer>
            </div>
         </CardContent>
      </Card>
   );
};

export default SimpleChart;
