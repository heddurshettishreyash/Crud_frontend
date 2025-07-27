import { useState, useEffect } from "react";
import { DynamicTable } from "../components/tables/DynamicTable";
import { useForm } from "react-hook-form";
import { Application } from "../types/Application";
import "bootstrap/dist/css/bootstrap.min.css";
import { DynamicForm } from "../components/forms/DyanmicForm";
import { DynamicFilter } from "../components/filter/DyanamicFilter";
import { DyanamicSorting } from "../components/sorting/DyanamicSorting";
import { DyanamicPagination } from "../components/pagination/DyanamicPagination";

const URL = "https://crud-backend-lfj2.onrender.com/app";

export default function ApplicationView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("appName");
  const [direction, setDirection] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(5);
  const [filterType, setFilterType] = useState<string>("appType");
  const [filterValue, setFilterValue] = useState<string>("");

  const columns = [
    { key: "orgId", label: "Org ID" },
    { key: "appId", label: "App ID" },
    { key: "appName", label: "Name" },
    { key: "appDesc", label: "App Description" },
    { key: "appType", label: "App Type" },
  ];

  const fields: {
    name: keyof Application;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    validation?: Record<string, any>;
  }[] = [
    {
      name: "orgId",
      label: "Organization Id",
      placeholder: "Organization Id Name",
      type: "text",
      required: true,
    },
    {
      name: "appName",
      label: "Application Name",
      placeholder: "Name",
      type: "text",
      required: true,
      validation: {
        minLength: {
          value: 5,
          message: "Application name must be at least 5 characters long.",
        },
        maxLength: {
          value: 100,
          message: "Application name must be at most 100 characters long.",
        },
      },
    },
    {
      name: "appDesc",
      label: "Description",
      placeholder: "Description",
      type: "text",
      required: true,
      validation: { message: "Application Description must not be null" },
    },
    {
      name: "appType",
      label: "Application Type",
      placeholder: "Application Type",
      type: "text",
      required: true,
      validation: { message: "Application Type must not be null" },
    },
  ];
  const {} = useForm<Application>();

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${URL}/filter?sortBy=${sortBy}&direction=${direction}&limit=${pageSize}&offset=${
          currentPage * pageSize
        }&filterType=${filterType}&filterValue=${filterValue}`
      );
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError("Error fetching applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [sortBy, direction, currentPage, filterType, filterValue]);

  const handleFilter = (newFilterType: string, newFilterValue: string) => {
    setFilterType(newFilterType);
    setFilterValue(newFilterValue);
    setCurrentPage(0);
  };

  const handleCreate = async (data: Application) => {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const createdApp = await response.json();
      setApplications((prev) => [...prev, createdApp]);
      setSuccess("Application created successfully.");
      setSelectedApp(null);
    } catch (err) {
      setError("Error creating Application.");
    }
  };

  const handleUpdate = async (data: Application) => {
    if (!selectedApp) {
      setError("No Application selected for update.");
      return;
    }
    try {
      await fetch(`${URL}/${selectedApp.appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.appId === selectedApp.appId ? { ...app, ...data } : app
        )
      );
      setSuccess("Application updated successfully.");
      setSelectedApp(null);
    } catch (err) {
      setError("Error updating Application.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${URL}/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((app) => app.appId !== id));
      setSuccess("Application deleted successfully.");
    } catch (err) {
      setError("Error deleting Application.");
    }
  };

  return (
    <div className="container">
      <h2>Application Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <DynamicForm<Application>
        onSubmit={selectedApp ? handleUpdate : handleCreate}
        fields={fields}
        initialData={selectedApp}
        setSelectedData={setSelectedApp}
      />

      <div className="d-flex align-items-center gap-3">
        <DynamicFilter
          filterTypes={[
            { value: "appType", label: "Application Type" },
            { value: "appDesc", label: "Application Desc" },
            { value: "appId", label: "Application Id" },
          ]}
          onFilter={handleFilter}
        />
        <DyanamicSorting
          sortBy={sortBy}
          direction={direction}
          onSortChange={(newSortBy, newDirection) => {
            setSortBy(newSortBy);
            setDirection(newDirection);
            setCurrentPage(0);
          }}
          options={[
            { value: "appId", label: "App ID" },
            { value: "appName", label: "App Name" },
            { value: "appType", label: "App Type" },
            { value: "appDesc", label: "App Description" },
          ]}
        />
      </div>

      <DynamicTable
        data={applications}
        columns={columns}
        idKey="appId"
        onEdit={(app) => setSelectedApp(app)}
        onDelete={(id) => handleDelete(id)}
      />

      <DyanamicPagination
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
