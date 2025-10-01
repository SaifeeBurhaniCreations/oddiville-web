

import { useEffect, useState } from "react";
import { create, modify } from "@/services/WorkLocationService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    handleModifyData,
    handlePostData,
} from "@/redux/WorkLocationSlice";
import { useFormValidator } from "/custom_library/formValidator/useFormValidator"; 
import { initialLocationState, locationValidationSchema } from "@/schemas/WorkLocationSchema";

const useManageWorkLocation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const param = useParams();
    const { id } = param; 

    const workLocationData = useSelector((state) => state.location.data);

    const [isLoading, setIsLoading] = useState(false);
    const [banners, setBanners] = useState(null); 
    const [fetchedBanners, setFetchedBanners] = useState(null);
    const [deleteBanners, setDeleteBanners] = useState(false); 

    const form = useFormValidator(
        initialLocationState,
        locationValidationSchema,
        { validateOnChange: true, debounce: 300 }
    );
    

    const fetchBanners = (file) => {
      
        setBanners(file);
        
        form.setField("sample_image", file);
    };

    const handleExit = () => {
        setFetchedBanners(null);
        setBanners(null);
        setDeleteBanners(false);
        form.setFields(initialLocationState);
        navigate("/work-location");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    
        const result = form.validateForm();
        
       
        const isCreating = !id;
        const hasNewBanner = banners;
        const hasExistingBanner = fetchedBanners && !deleteBanners;

       
        if (isCreating && !hasNewBanner) {
             toast.error("Image is required for a new location.");
             return;
        }


        if (!result.success) return;

     
        const formPayload = new FormData();
        formPayload.append("location_name", result.data.location_name);
        formPayload.append("description", result.data.description);
        
        if (banners) {
            formPayload.append("sample_image", banners); 
        }
        if (id && deleteBanners && !banners) {
         
            formPayload.append("deleteBanner", "true"); 
        }

       
        setIsLoading(true);
        try {
            let response;
            if (isCreating) {
                response = await create(formPayload);
                if (response.status === 201) {
                    dispatch(handlePostData(response.data));
                    toast.success("Location is Added!");
                } else {
                    throw new Error("Failed to create location.");
                }
            } else {
                // Update
                response = await modify({ formData: formPayload, id });
                if (response.status === 200) {
                    dispatch(handleModifyData(response.data));
                    toast.success("Location is Updated!");
                } else {
                    throw new Error("Failed to update location.");
                }
            }
            navigate("/work-location");
        } catch (error) {
            toast.error(error.message || "An error occurred while processing the location.");
        } finally {
            setIsLoading(false);
        }
    };


   
    useEffect(() => {
        if (id) {
            const data = workLocationData?.find((value) => value.id === id);
            if (data) {
     
                form.setFields({
                    location_name: data.location_name,
                    description: data.description,
                  
                });
               
                setFetchedBanners(data.sample_image);
            }
        } else {
           
            setFetchedBanners(null);
            setBanners(null);
            setDeleteBanners(false);
            form.setFields(initialLocationState);
        }
    }, [id, workLocationData]);


    return {
        id,
        form,
        isLoading,
        banners,
        fetchedBanners,
        deleteBanners,
        setDeleteBanners,
        fetchBanners,
        handleSubmit,
        handleExit,
    };
};

export default useManageWorkLocation;