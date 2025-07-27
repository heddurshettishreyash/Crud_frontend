import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DynamicChartProps } from "../../types/DyanamicChart";

const DynamicD3Chart: React.FC<DynamicChartProps> = ({
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
  const chartRef = useRef<SVGSVGElement | null>(null);

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

  useEffect(() => {
    if (!chartRef.current || error) return;
    d3.select(chartRef.current).selectAll("*").remove();

    const secondaryMapping = secondaryData.reduce(
      (acc: Record<string, string>, item: any) => {
        if (labelField) {
          acc[item[groupByField]] = item[labelField];
        }
        return acc;
      },
      {}
    );

    const groupedData = primaryData.reduce(
      (acc: Record<string, number>, item: any) => {
        const groupKey = item[groupByField] || "Unknown";
        const label = secondaryMapping[groupKey] || groupKey;
        acc[label] = (acc[label] || 0) + (item[valueField] || 1);
        return acc;
      },
      {}
    );

    const data = Object.entries(groupedData).map(([key, value]) => ({
      name: key,
      value: Math.round(value), // Round to the nearest integer
    }));

    const width = 600,
      height = 400,
      margin = { top: 50, right: 30, bottom: 50, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "lightgray")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    if (chartType === "bar") {
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width - margin.left - margin.right])
        .padding(0.2);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)!])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      svg
        .append("g")
        .call(d3.axisLeft(y).ticks(y.domain()[1]).tickFormat(d3.format("d")));
      svg
        .append("g")
        .attr(
          "transform",
          `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(d3.axisBottom(x));

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name)! as number)
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - margin.top - margin.bottom - y(d.value))
        .attr("fill", "steelblue")
        .on("mouseover", (d) => {
          tooltip.style("visibility", "visible").text(`${d.name}: ${d.value}`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
    } else if (chartType === "pie") {
      const radius = Math.min(width, height) / 2 - margin.top;
      const pie = d3
        .pie<{ name: string; value: number }>()
        .value((d) => d.value);
      const arc = d3
        .arc<d3.PieArcDatum<{ name: string; value: number }>>()
        .innerRadius(0)
        .outerRadius(radius);

      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pieGroup = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width / 2 - margin.left}, ${height / 2 - margin.top})`
        );

      pieGroup
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (i) => color(i.toString())!)
        .attr("stroke", "#fff")
        .style("stroke-width", "2px")
        .on("mouseover", (d) => {
          tooltip
            .style("visibility", "visible")
            .text(`${d.data.name}: ${d.data.value}`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
    } else if (chartType === "line") {
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width - margin.left - margin.right]);

      const yMax = d3.max(data, (d) => d.value)!; // Get max value
      const y = d3
        .scaleLinear()
        .domain([0, yMax])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      // Manually define integer tick values
      const yTicks = Array.from({ length: yMax + 1 }, (_, i) => i);

      svg.append("g").call(
        d3
          .axisLeft(y)
          .tickValues(yTicks) // Set tick values manually
          .tickFormat(d3.format("d")) // Ensure integers
      );

      const line = d3
        .line<{ name: string; value: number }>()
        .x((d) => x(d.name)! + x.bandwidth() / 2)
        .y((d) => y(d.value));

      svg
        .append("g")
        .attr(
          "transform",
          `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(d3.axisBottom(x));

      svg
        .append("path")
        .data([data])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.name)! + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.value))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .on("mouseover", (d) => {
          tooltip.style("visibility", "visible").text(`${d.name}: ${d.value}`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
    }
  }, [primaryData, secondaryData, chartType, error]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default DynamicD3Chart;
