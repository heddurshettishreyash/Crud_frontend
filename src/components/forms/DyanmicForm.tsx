import { DynamicFormProps } from "../../types/DyanamicForm";
import { useEffect } from "react";
import { useForm, FieldValues, Path, FieldError } from "react-hook-form";

export const DynamicForm = <T extends FieldValues>({
  onSubmit,
  initialData,
  setSelectedData,
  fields,
}: DynamicFormProps<T>) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<T>();

  useEffect(() => {
    if (initialData) {
      fields.forEach((field) => {
        setValue(field.name as Path<T>, initialData[field.name]);
      });
    } else {
      reset();
    }
  }, [initialData, setValue, reset, fields]);

  const handleCancel = () => {
    setSelectedData(null);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row mb-4">
      {fields.map((field) => (
        <div key={String(field.name)} className="col-md-2">
          <input
            {...register(field.name as Path<T>, {
              required: field.required ? `${field.label} is required` : false,
              ...(field.validation || {}),
            })}
            className="form-control"
            type={field.type}
            placeholder={field.label}
          />
          {errors[field.name as Path<T>] && (
            <small className="text-danger">
              {(errors[field.name as Path<T>] as FieldError).message}
            </small>
          )}
        </div>
      ))}
      <div className="col-md-2">
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary btn-sm w-120">
            {initialData ? "Update" : "Create"}
          </button>
          {initialData && (
            <button
              type="button"
              className="btn btn-secondary btn-sm w-120"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
