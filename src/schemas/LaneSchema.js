

export const initialLaneState = {
    name: "",
    description: "",
};

export const laneValidationSchema = {
    name: [
        { type: "required", message: "Lane name is required" },
        { type: "minLength", length: 3, message: "Minimum 3 characters needed" },
    ],
    description: [
        { type: "required", message: "Lane description is required" },
        { type: "minLength", length: 5, message: "Description must be at least 5 characters" },
    ],
};