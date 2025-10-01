
import useManageWorkLocation from "@/hooks/useManageWorkLocation";
import WorkLocationForm from "@/components/forms/WorkLocationForm";

const AddWorkLocation = () => {
   
    const {
        id,
        form,
        isLoading,
        fetchedBanners,
        deleteBanners,
        setDeleteBanners,
        fetchBanners,
        handleSubmit,
        handleExit,
    } = useManageWorkLocation();

    return (
        <WorkLocationForm
            id={id}
            form={form}
            isLoading={isLoading}
            fetchedBanners={fetchedBanners}
            deleteBanners={deleteBanners}
            setDeleteBanners={setDeleteBanners}
            fetchBanners={fetchBanners}
            handleSubmit={handleSubmit}
            handleExit={handleExit}
        />
    );
};

export default AddWorkLocation;