import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { DynamicChartProps } from "../../types/DyanamicChart";

const DynamicChart: React.FC<DynamicChartProps> = ({
  title,
  primaryEndpoint,
  secondaryEndpoint,
  groupByField,
  valueField,
  labelField,
  chartType,
}) => {
  const [primaryData, setPrimaryData] = useState<any[]>([]);
  const [secondaryData, setSecondaryData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  //Fetched primary and secondary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [primary, secondary] = await Promise.all([
          primaryEndpoint(),
          secondaryEndpoint ? secondaryEndpoint() : Promise.resolve([]),
        ]);
        setPrimaryData(primary);
        setSecondaryData(secondary);
      } catch {
        setError("Error fetching data.");
      }
    };
    fetchData();
  }, [primaryEndpoint, secondaryEndpoint]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  //Secondary mapping for id
  const secondaryMapping = secondaryData.reduce(
    (acc: Record<string, string>, item: any) => {
      if (labelField) {
        acc[item[groupByField]] = item[labelField];
      }
      return acc;
    },
    {}
  );
  //primary mapping for name
  const groupedData = primaryData.reduce(
    (acc: Record<string, number>, item: any) => {
      const groupKey = item[groupByField] || "Unknown";
      const label = secondaryMapping[groupKey] || groupKey;
      acc[label] = (acc[label] || 0) + (item[valueField] || 1);
      return acc;
    },
    {}
  );

  const options = {
    title: { text: title, left: "center" },
    tooltip:
      chartType === "pie"
        ? { trigger: "item", formatter: "{a} <br/>{b}: {c}" }
        : { trigger: "axis", axisPointer: { type: "shadow" } },
    legend:
      chartType === "pie" ? { orient: "vertical", left: "left" } : undefined,
    xAxis:
      chartType !== "pie"
        ? { type: "category", data: Object.keys(groupedData) }
        : undefined,
    yAxis:
      chartType !== "pie"
        ? { type: "value", name: "Count", minInterval: 1 }
        : undefined,
    series: [
      {
        name: "Data",
        type: chartType,
        data:
          chartType === "pie"
            ? Object.keys(groupedData).map((key) => ({
                name: key,
                value: groupedData[key],
              }))
            : Object.values(groupedData),
        ...(chartType === "line" && {
          smooth: true,
          lineStyle: { color: "rgba(75, 192, 192, 1)" },
          symbol: "circle",
          symbolSize: 8,
        }),
        ...(chartType === "bar" && {
          itemStyle: { color: "rgba(75, 192, 192, 0.8)" },
        }),
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: 600 }} />;
};

export default DynamicChart;
