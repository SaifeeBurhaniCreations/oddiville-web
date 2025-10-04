
import Spinner from "@/components/Spinner/Spinner";
import Banners from "@/components/Banners/Banners"; 

const WorkLocationForm = ({
    id,
    form,
    isLoading,
    fetchedBanners,
    deleteBanners,
    setDeleteBanners,
    fetchBanners,
    handleSubmit,
    handleExit,
}) => {
    
    const { values, errors, setField } = form;

    return (
        <form onSubmit={handleSubmit}>
            <div className="card">
                <div className="card-header flex-cs gap-2 justify-content-between pt-4 pb-2">
                    <h6>Manage Work Locations</h6>
                    {id && (
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={handleExit}
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="card-body grid-cs gtc-1 pb-4">
                   
                    <Banners
                        name="Upload Location"
                        form={form} 
                        getBanners={fetchedBanners} 
                        deleteBanners={deleteBanners}
                        setDeleteBanners={setDeleteBanners}
                        fetchBanners={fetchBanners}
                    />
                    
                    <div className="grid-cs gtc-1">
                       
                        <div>
                            <input
                                type="text"
                                value={values.location_name}
                                onChange={(e) => setField("location_name", e.target.value)}
                                className={`form-control ${errors.location_name ? 'is-invalid' : ''}`}
                                name="location_name"
                                placeholder="Location Name"
                            />
                            {errors.location_name && <div className="text-danger mt-1">{errors.location_name}</div>}
                        </div>
                        
                    
                        <div>
                            <input
                                type="text"
                                value={values.description}
                                onChange={(e) => setField("description", e.target.value)}
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                name="description"
                                placeholder="Service Description"
                            />
                            {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                        </div>
                    </div>
                </div>
                
                
                <div className="card-footer">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary btn-md m-0"
                    >
                        {id ? "Update" : "Save"} Location {isLoading && <Spinner />}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default WorkLocationForm;