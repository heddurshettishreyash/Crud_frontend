import { useState } from "react";

interface SortingProps {
  sortBy: string;
  direction: string;
  onSortChange: (sortBy: string, direction: string) => void;
  options: { value: string; label: string }[];
}
const inputStyle = {
  height: "30px",
  width: "160px",
  fontSize: "14px",
  padding: "4px 8px",
};

const buttonStyle = {
  height: "30px",
  width: "70px",
  fontSize: "14px",
  padding: "4px 12px",
};

export const DyanamicSorting: React.FC<SortingProps> = ({
  sortBy,
  direction,
  onSortChange,
  options,
}) => {
  const [localSortBy, setLocalSortBy] = useState<string>(sortBy);
  const [localDirection, setLocalDirection] = useState<string>(direction);

  const handleSort = () => {
    onSortChange(localSortBy, localDirection);
  };

  return (
    <div className="d-flex justify-content align-items-center my-3">
      <div className="me-3">
        <select
          id="sortBy"
          className="form-select"
          style={inputStyle}
          value={localSortBy}
          onChange={(e) => setLocalSortBy(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="me-3">
        <select
          id="direction"
          className="form-select"
          style={inputStyle}
          value={localDirection}
          onChange={(e) => setLocalDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <button
        className="btn btn-primary"
        style={buttonStyle}
        onClick={handleSort}
      >
        Sort
      </button>
    </div>
  );
};
