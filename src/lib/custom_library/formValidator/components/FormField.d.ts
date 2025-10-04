import React from 'react';
type FormFieldProps<T> = {
    name: string;
    form: {
        values: T;
        setField: (key: string, value: any) => void;
        errors: Record<string, string | undefined>;
    };
    style?: React.CSSProperties;
    children: (field: {
        value: any;
        onChange: (val: any) => void;
        error?: string;
        style?: React.CSSProperties;
    }) => React.ReactNode;
};
declare function FormField<T>({ name, form, style, children, }: FormFieldProps<T>): React.ReactNode;
export default FormField;
