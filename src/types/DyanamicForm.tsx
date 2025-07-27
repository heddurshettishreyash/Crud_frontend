import { FieldValues, SubmitHandler } from 'react-hook-form';

export interface DynamicFormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  initialData?: T | null;
  setSelectedData: React.Dispatch<React.SetStateAction<T | null>>;
  fields: { name: keyof T; label: string; type: string; required?: boolean; validation?: Record<string, any> }[];
}
