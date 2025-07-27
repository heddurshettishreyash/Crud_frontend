import React from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}
export interface DynamicTableProps {
  data: Array<Record<string, any>>;
  columns: ColumnConfig[];
  idKey: string;
  onEdit: (item: any) => void;
  onDelete: (id: any) => void;
}
