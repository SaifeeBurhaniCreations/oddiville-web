import { ErrorMap, Rules, UseFormValidatorOptions } from "./types/formValidator";
export declare function useMultiStepFormValidator<T extends Record<string, any>>(initial: Partial<T>, rules: Rules<T>, stepFieldMap: Record<number, string[]>, options?: UseFormValidatorOptions, externalStep?: number): {
    validateCurrentStep: (customValues?: T) => {
        success: true;
    } | {
        success: false;
        errors: ErrorMap<T>;
    };
    isCurrentStepValid: boolean;
    values: any;
    errors: any;
    setField: (key: string, value: any) => void;
    setFields: (updates: Partial<T>) => void;
    validateForm: (customValues?: T | undefined) => {
        success: true;
        data: T;
    } | {
        success: false;
        errors: ErrorMap<T>;
    };
    validateField: (key: string, customValues?: T | undefined) => string | undefined;
    setError: (key: string, message: string) => void;
    setErrors: (allErrors: ErrorMap<T>) => void;
    resetForm: () => void;
    isValid: boolean;
};
