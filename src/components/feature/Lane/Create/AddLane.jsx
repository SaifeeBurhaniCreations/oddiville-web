import useManageLane from "@/hooks/useLanesManager";
import LaneForm from "@/components/forms/LaneForm";

const AddLane = () => {

    const {
        id,
        form,
        isLoading,
        handleSubmit,
        handleExit,
    } = useManageLane();

    return (
        <LaneForm
            id={id}
            form={form}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleExit={handleExit}
        />
    );
};

export default AddLane;