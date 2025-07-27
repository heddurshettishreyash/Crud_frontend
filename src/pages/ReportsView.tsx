import { useState } from "react";
import DynamicChart from "../components/charts/DyanamicChart";

const ORG_URL = "https://crud-backend-lfj2.onrender.com/org";
const APP_URL = "https://crud-backend-lfj2.onrender.com/app";
const USER_URL = "https://crud-backend-lfj2.onrender.com/users";

const ReportsView = () => {
  const [chartCategory, setChartCategory] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<string>("pie");

  const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const renderChartSelection = () => {
    switch (activeChart) {
      case "pie":
        return (
          <DynamicChart
            title={
              chartCategory === "application"
                ? "Applications per Organization"
                : "Users per Application"
            }
            primaryEndpoint={
              chartCategory === "application"
                ? () => fetchData(APP_URL)
                : () => fetchData(USER_URL)
            }
            secondaryEndpoint={
              chartCategory === "application"
                ? () => fetchData(ORG_URL)
                : () => fetchData(APP_URL)
            }
            groupByField={chartCategory === "application" ? "orgId" : "appId"}
            valueField="1"
            labelField={chartCategory === "application" ? "orgName" : "appName"}
            chartType="pie"
          />
        );
      case "line":
        return (
          <DynamicChart
            title={
              chartCategory === "application"
                ? "Applications per Organization"
                : "Users per Application"
            }
            primaryEndpoint={
              chartCategory === "application"
                ? () => fetchData(APP_URL)
                : () => fetchData(USER_URL)
            }
            secondaryEndpoint={
              chartCategory === "application"
                ? () => fetchData(ORG_URL)
                : () => fetchData(APP_URL)
            }
            groupByField={chartCategory === "application" ? "orgId" : "appId"}
            valueField="1"
            labelField={chartCategory === "application" ? "orgName" : "appName"}
            chartType="line"
          />
        );
      case "bar":
        return (
          <DynamicChart
            title={
              chartCategory === "application"
                ? "Applications per Organization"
                : "Users per Application"
            }
            primaryEndpoint={
              chartCategory === "application"
                ? () => fetchData(APP_URL)
                : () => fetchData(USER_URL)
            }
            secondaryEndpoint={
              chartCategory === "application"
                ? () => fetchData(ORG_URL)
                : () => fetchData(APP_URL)
            }
            groupByField={chartCategory === "application" ? "orgId" : "appId"}
            valueField="1"
            labelField={chartCategory === "application" ? "orgName" : "appName"}
            chartType="bar"
          />
        );
      default:
        return null;
    }
  };

  if (!chartCategory) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Select Chart Category</h2>
        <button
          onClick={() => setChartCategory("application")}
          style={{
            padding: "15px 30px",
            margin: "20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Application Charts
        </button>
        <button
          onClick={() => setChartCategory("user")}
          style={{
            padding: "15px 30px",
            margin: "20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          User Charts
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        {["pie", "line", "bar"].map((chart) => (
          <button
            key={chart}
            onClick={() => setActiveChart(chart)}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: activeChart === chart ? "#4CAF50" : "#f0f0f0",
              border: "none",
              cursor: "pointer",
            }}
          >
            {chart.charAt(0).toUpperCase() + chart.slice(1)} Chart
          </button>
        ))}
      </div>

      <div style={{ height: "600px" }}>{renderChartSelection()}</div>
    </div>
  );
};

export default ReportsView;
