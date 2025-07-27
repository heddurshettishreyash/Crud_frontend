import { useState, useEffect } from "react";
import { DynamicTable } from "../components/tables/DynamicTable";
import { useForm } from "react-hook-form";
import { User } from "../types/User";
import "bootstrap/dist/css/bootstrap.min.css";
import { DynamicForm } from "../components/forms/DyanmicForm";
import { DyanamicSorting } from "../components/sorting/DyanamicSorting";
import { DyanamicPagination } from "../components/pagination/DyanamicPagination";
import { DynamicFilter } from "../components/filter/DyanamicFilter";

const URL = "https://crud-backend-lfj2.onrender.com/users";

export default function UserView() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("userName");
  const [direction, setDirection] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(5);
  const [filterType, setFilterType] = useState<string>("userName");
  const [filterValue, setFilterValue] = useState<string>("");

  const { reset } = useForm<User>();

  const columns = [
    { key: "userId", label: "User ID" },
    { key: "appId", label: "Application ID" },
    { key: "userName", label: "Name" },
    { key: "userEmail", label: "Email" },
    { key: "userRole", label: "Role" },
  ];

  const fields: {
    name: keyof User;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    validation?: Record<string, any>;
  }[] = [
    {
      name: "appId",
      label: "Application ID",
      placeholder: "Application ID",
      type: "text",
      required: true,
    },
    {
      name: "userName",
      label: "User Name",
      placeholder: "User Name",
      type: "text",
      required: true,
      validation: {
        minLength: {
          value: 5,
          message: "User name must be at least 5 characters long.",
        },
        maxLength: {
          value: 100,
          message: "User name must be at most 100 characters long.",
        },
      },
    },
    {
      name: "userEmail",
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
      name: "userPassword",
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      validation: {
        minLength: {
          value: 5,
          message: "User password must be number and least 4 characters long.",
        },
        maxLength: {
          value: 100,
          message: "User password must be at most 100 characters long.",
        },
      },
    },
    {
      name: "userRole",
      label: "Role",
      placeholder: "Role",
      type: "text",
      required: true,
      validation: {
        minLength: {
          value: 5,
          message: "User Role must be   least 5 characters long.",
        },
        maxLength: {
          value: 100,
          message: "User Role must be at most 100 characters long.",
        },
      },
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${URL}/filter?sortBy=${sortBy}&direction=${direction}&limit=${pageSize}&offset=${
          currentPage * pageSize
        }&filterType=${filterType}&filterValue=${filterValue}`
      );
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Error fetching users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, direction, currentPage, filterType, filterValue]);

  const handleCreate = async (data: User) => {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const createdUser = await response.json();
      setUsers((prev) => [...prev, createdUser]);
      setSuccess("User created successfully.");
      reset();
    } catch (err) {
      setError("Error creating user.");
    }
  };

  const handleUpdate = async (data: User) => {
    if (!selectedUser) return;
    try {
      await fetch(`${URL}/${selectedUser.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === selectedUser.userId ? { ...user, ...data } : user
        )
      );
      setSuccess("User updated successfully.");
      setSelectedUser(null);
      reset();
    } catch (err) {
      setError("Error updating user.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${URL}/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((user) => user.userId !== id));
      setSuccess("User deleted successfully.");
    } catch (err) {
      setError("Error deleting user.");
    }
  };

  return (
    <div className="container">
      <h2>User Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <DynamicForm<User>
        onSubmit={selectedUser ? handleUpdate : handleCreate}
        fields={fields}
        initialData={selectedUser}
        setSelectedData={setSelectedUser}
      />

      <div className="d-flex align-items-center gap-3">
        <DynamicFilter
          filterTypes={[
            { value: "userId", label: "User ID" },
            { value: "userName", label: "Name" },
            { value: "userRole", label: "Role" },
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
            { value: "userId", label: "ID" },
            { value: "userName", label: "Name" },
            { value: "userRole", label: "Role" },
          ]}
        />
      </div>

      <DynamicTable
        data={users}
        columns={columns}
        idKey="userId"
        onEdit={(user) => setSelectedUser(user)}
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
