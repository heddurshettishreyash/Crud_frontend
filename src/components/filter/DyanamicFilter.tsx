import React, { useState } from 'react';

interface DynamicFilterProps {
  filterTypes: { value: string; label: string }[];
  onFilter: (filterType: string, filterValue: string) => void;
}
const inputStyle = {
  height: '30px',
  width: '160px',
  fontSize: '14px',
  padding: '4px 8px',
};

const buttonStyle = {
  height: '30px',
  width: '70px',
  fontSize: '14px',
  padding: '4px 12px',
};
export const DynamicFilter: React.FC<DynamicFilterProps> = ({ filterTypes, onFilter }) => {
  const [filterType, setFilterType] = useState<string>(filterTypes[0]?.value || '');
  const [filterValue, setFilterValue] = useState<string>('');

  const handleApplyFilter = () => {
    if (filterType && filterValue) {
      onFilter(filterType, filterValue);
    }
  };

  return (
    <div className="d-flex justify-content align-items-center my-3">
      <div className="me-3">
        <select
          id="filterType"
          className="form-select"
          style={inputStyle}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}>
          {filterTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="me-3">
        <input
          id="filterValue"
          type="text"
          className="form-control"
          style={inputStyle}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Enter filter value"
        />
      </div>
      <button className="btn btn-primary" style={buttonStyle} onClick={handleApplyFilter}>
        Filter
      </button>
    </div>
  );
};
