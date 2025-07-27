import { useState, useEffect } from "react";
import { DynamicTable } from "../components/tables/DynamicTable";
import { useForm } from "react-hook-form";
import { Organization } from "../types/Organization";
import "bootstrap/dist/css/bootstrap.min.css";
import { DynamicForm } from "../components/forms/DyanmicForm";
import { DyanamicSorting } from "../components/sorting/DyanamicSorting";
import { DyanamicPagination } from "../components/pagination/DyanamicPagination";
import { DynamicFilter } from "../components/filter/DyanamicFilter";

const URL = "https://crud-backend-lfj2.onrender.com/org";

export default function OrganizationView() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("orgName");
  const [direction, setDirection] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(5);
  const [filterType, setFilterType] = useState<string>("orgName");
  const [filterValue, setFilterValue] = useState<string>("");
  const { reset } = useForm<Organization>();
  const columns = [
    { key: "orgId", label: "Org ID" },
    {
      key: "orgName",
      label: "Name",
      render: (value: string, item: Organization) => (
        <div>
          <strong>{value}</strong>
          <br />
          <small>{item.orgAddress}</small>
        </div>
      ),
    },
    { key: "orgEmail", label: "Email" },
    { key: "orgNumber", label: "Contact Number" },
  ];

  // Form fields
  const fields: {
    name: keyof Organization;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    validation?: Record<string, any>;
  }[] = [
    {
      name: "orgName",
      label: "Organization Name",
      placeholder: "Organization Name",
      type: "text",
      required: true,
      validation: {
        minLength: {
          value: 5,
          message: "Organization name must be at least 5 characters long.",
        },
        maxLength: {
          value: 100,
          message: "Organization name must be at most 100 characters long.",
        },
      },
    },
    {
      name: "orgAddress",
      label: "Address",
      placeholder: "Address",
      type: "text",
      required: true,
      validation: {
        minLength: {
          value: 5,
          message: "Organization address must be at least 5 characters long.",
        },
        maxLength: {
          value: 100,
          message: "Organization address must be at most 100 characters long.",
        },
      },
    },
    {
      name: "orgEmail",
      label: "Email",
      placeholder: "Email",
      type: "email",
      required: true,
      validation: {
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Please Enter Valid Email Address",
        },
      },
    },
    {
      name: "orgNumber",
      label: "Phone Number",
      placeholder: "Phone Number",
      type: "tel",
      required: true,
      validation: {
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Phone Number must be exactly 10 digits",
        },
      },
    },
  ];
  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${URL}/filter?sortBy=${sortBy}&direction=${direction}&limit=${pageSize}&offset=${
          currentPage * pageSize
        }&filterType=${filterType}&filterValue=${filterValue}`
      );
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError("Error fetching applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [sortBy, direction, currentPage, filterType, filterValue]);

  const handleCreate = async (data: Organization) => {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const createdOrg = await response.json();
      setOrganizations((prev) => [...prev, createdOrg]);
      setSuccess("Organization created successfully.");
      reset();
    } catch (err) {
      setError("Error creating organization.");
    }
  };

  const handleUpdate = async (data: Organization) => {
    if (!selectedOrg) return;
    try {
      const response = await fetch(`${URL}/${selectedOrg.orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update organization");

      setOrganizations((prev) =>
        prev.map((org) =>
          org.orgId === selectedOrg.orgId ? { ...org, ...data } : org
        )
      );
      setSuccess("Organization updated successfully.");
      setSelectedOrg(null);
      reset();
    } catch (err) {
      setError("Error updating organization.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete organization");

      setOrganizations((prev) => prev.filter((org) => org.orgId !== id));
      setSuccess("Organization deleted successfully.");
    } catch (err) {
      setError("Error deleting organization.");
    }
  };

  return (
    <div className="container">
      <h2>Organization Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <DynamicForm<Organization>
        onSubmit={selectedOrg ? handleUpdate : handleCreate}
        fields={fields}
        initialData={selectedOrg}
        setSelectedData={setSelectedOrg}
      />

      <div className="d-flex align-items-center gap-3">
        <DynamicFilter
          filterTypes={[
            { value: "orgId", label: "Organization ID" },
            { value: "orgName", label: "Organization Name" },
            { value: "orgEmail", label: "Organization Email" },
            { value: "orgNumber", label: "Organization Number" },
          ]}
          onFilter={(newFilterType, newFilterValue) => {
            setFilterType(newFilterType);
            setFilterValue(newFilterValue);
            setCurrentPage(0);
          }}
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
            { value: "orgId", label: "ID" },
            { value: "orgName", label: "Name" },
            { value: "orgEmail", label: "Email" },
            { value: "orgAddress", label: "Address" },
            { value: "orgNumber", label: "Phone Number" },
          ]}
        />
      </div>

      <DynamicTable
        data={organizations}
        columns={columns}
        idKey="orgId"
        onEdit={(org) => setSelectedOrg(org)}
        onDelete={(id) => handleDelete(id)}
      />

      <DyanamicPagination
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
}
