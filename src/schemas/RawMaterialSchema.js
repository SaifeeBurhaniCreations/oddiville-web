

export const initialClientValues = {
    name: '',
    company: '',
    address: '',
    phone: '',
    products: [],
    sample_image: null,
};

export const initialNewProductState = {
    product_name: '',
    est_dispatch_date: '',
    rent: '',
    selectedChambers: [],
};

// CLIENT VALIDATION RULES
export const clientValidationRules = {
    name: [{ type: 'required', message: 'Client Name is required' }],
    company: [{ type: 'required', message: 'Company Name is required' }],
    address: [{ type: 'required', message: 'Address is required' }],
    phone: [
        { type: 'required', message: 'Phone is required' },
        { type: 'number', message: 'Phone must be a number' },
        { type: 'minLength', length: 10, message: 'Phone must be 10 digits' },
        { type: 'maxLength', length: 10, message: 'Phone must be 10 digits' },
    ],
};

// PRODUCT VALIDATION RULES
export const productValidationRules = {
    product_name: [{ type: 'required', message: 'Product name is required' }],
    rent: [
        { type: 'required', message: 'Rent is required' },
        { type: 'number', message: 'Rent must be a number' }
    ],
    est_dispatch_date: [{ type: 'required', message: 'Dispatch date is required' }],
    sample_image: [{ type: 'required', message: 'Product image is required' }],
};