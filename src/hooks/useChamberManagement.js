import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormValidator } from "@/lib/custom_library/formValidator/useFormValidator";
import {
  createChamber,
  removeChamber,
  fetchChamber,
} from "@/services/DryChamberService";
import {
  initialChamberState,
  chamberValidationSchema,
} from "@/schemas/ChamberSchema";

const useChamberManagement = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.ServiceDataSlice.chamber);
  const [chamberToDelete, setChamberToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const addChamberForm = useFormValidator(
    initialChamberState,
    chamberValidationSchema,
    { validateOnChange: true, debounce: 300 }
);

let chambersList = useRef();

  useEffect(() => {
    const loadChambers = async () => {
      if (!categories || categories.length === 0) {
        setIsInitialLoading(true);
        try {
          const res = await fetchChamber();
          if (res.status === 200) {
            dispatch({
              type: "ServiceDataSlice/handleFetchCategory",
              payload: res.data,
            });
          }
          chambersList.current = res.data;
          console.log(chambersList.current);
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch chambers");
        } finally {
          setIsInitialLoading(false);
        }
      }
    };
    loadChambers();
  }, [categories, dispatch]);
// console.log(chambersList.current);

  

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = addChamberForm.validateForm();
    if (!result.success) return;

    setIsLoading(true);
    try {
      const response = await createChamber(result.data);
      if (response.status === 201) {
        dispatch({
          type: "ServiceDataSlice/handlePostCategory",
          payload: response.data,
        });
        toast.success("Chamber added successfully");
        addChamberForm.setFields(initialChamberState);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add chamber");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await removeChamber(categoryId);
      if (response.status === 200) {
        dispatch({
          type: "ServiceDataSlice/handleRemoveCategory",
          payload: categoryId,
        });
        toast.success("Chamber deleted successfully");
        setChamberToDelete(null);
      }
    } catch (error) {
      toast.error("Failed to delete chamber");
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(categories);

  return {
    addChamberForm,
    categories,
    chamberToDelete,
    isLoading,
    isInitialLoading,
    setChamberToDelete,
    handleSubmit,
    handleDelete,
    chambersList,
  };
};

export default useChamberManagement;
