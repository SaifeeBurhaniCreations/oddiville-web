import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormValidator } from "@/lib/custom_library/formValidator/useFormValidator.js"; 
import { create, modify, fetchLanes } from "@/services/LaneService";
import {
    handleModifyData,
    handlePostData,
    handleFetchData,
} from "@/redux/LaneDataSlice";
import { initialLaneState, laneValidationSchema } from "@/schemas/LaneSchema";

const useManageLane = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const lanes = useSelector((state) => state.lane.data);

    const [isLoading, setIsLoading] = useState(false);

    const form = useFormValidator(
        initialLaneState,
        laneValidationSchema,
        { validateOnChange: true, debounce: 300 }
    );

    // Fetch all lanes
    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const getLane = await fetchLanes();
                dispatch(handleFetchData(getLane.data));
            } catch (error) {
                toast.error("Failed to fetch data");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!lanes || lanes.length === 0) {
            fetchAll();
        }
    }, [dispatch, lanes]);

    // Prefill form when editing
    useEffect(() => {
        if (id && lanes?.length > 0) {
            const data = lanes.find((lane) => lane.id === id || lane._id === id);
            if (data) {
                form.setFields({
                    name: data.name || "",
                    description: data.description || "",
                });
            }
        } else if (!id) {
            form.resetForm();
        }
    }, [id, lanes]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = form.validateForm();

        if (!result.success) return;

        setIsLoading(true);
        try {
            if (!id) {
                // Create
                const response = await create(result.data);
                if (response.status === 201) {
                    dispatch(handlePostData(response.data));
                    toast.success("Lane Added !!");
                    form.resetForm();
                    navigate("/lane");
                } else {
                    toast.error(response.data.error || "Failed to add lane.");
                }
            } else {
                // Update
                const response = await modify({ formData: result.data, id });
                if (response.status === 200) {
                 
                    console.log(response.data)
                    dispatch(handleModifyData(response.data));
                    toast.success("Lane Updated !!");
                    form.resetForm();
                    navigate("/lane");
                } else {
                    toast.error(response.data.error || "Failed to update lane.");
                }
            }
        } catch (error) {
            toast.error("Error while processing lane.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExit = () => {
        form.resetForm();
        navigate("/lane");
    };

    return {
        id,
        form,
        isLoading,
        handleSubmit,
        handleExit,
    };
};

export default useManageLane;
