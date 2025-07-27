import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ColumnConfig, DynamicTableProps } from '../../types/DynamicTable';

export const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, idKey, onEdit, onDelete }) => (
  <table className="table">
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key}>{column.label}</th>
        ))}
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item[idKey]}>
          {columns.map((column) => (
            <td key={column.key}>{column.render ? column.render(item[column.key], item) : item[column.key]}</td>
          ))}
          <td>
            <button className="btn btn-warning me-2 btn-sm w-120" onClick={() => onEdit(item)}>
              <FaEdit /> Edit
            </button>
            <button className="btn btn-danger btn-sm w-120" onClick={() => onDelete(item[idKey])}>
              <FaTrash /> Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
