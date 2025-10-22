import useManageLane from "@/hooks/useManageLane";
import LaneForm from "@/components/forms/LaneForm";

const AddLane = () => {
  const { id, form, isLoading, handleSubmit, handleExit } = useManageLane();

  return (
    <div className="col-md-6 offset-md-2">
      <LaneForm
        id={id}
        form={form}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleExit={handleExit}
      />
    </div>
  );
};

export default AddLane;
