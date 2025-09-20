import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChamber, removeChamber } from "../../../../services/DryChamberService";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Spinner/Spinner";

const Chamber = () => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.ServiceDataSlice.chamber);
    const [isLoading, setIsLoading] = useState(false);
    const [newChamber, setNewChamber] = useState("");
    const [tag, setTag] = useState("frozen");
    const [capacity, setCapacity] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newChamber.trim()) {
            toast.error('Please enter a chamber name');
            return;
        }

        setIsLoading(true);
        try {
            const response = await createChamber({ chamber_name: newChamber.trim(), tag, capacity });
            if (response.status === 201) {
                dispatch({ type: 'ServiceDataSlice/handlePostCategory', payload: response.data });
                setNewChamber("");
                setCapacity("")
                toast.success('chamber added successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add chamber');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (categoryName) => {
        try {
            const response = await removeChamber(categoryName);
            if (response.status === 200) {
                dispatch({
                    type: 'ServiceDataSlice/handleRemoveCategory',
                    payload: categoryName
                });
                toast.success('chamber deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete chamber');
        }
    };

    return (
        <>
            <div className="card my-3">
                <div className="card-header pt-4 pb-2">
                    <div className="flex-cs header">
                        <h6>Dry Chamber Management</h6>
                    </div>
                </div>
                <div className="card-body">
                    {/* Add New chamber Form */}
                    <div className="grid-cs mb-4 gap-3">
                        <input
                            type="text"
                            value={newChamber}
                            onChange={(e) => setNewChamber(e.target.value)}
                            className='form-control'
                            placeholder='Enter Chamber Name'
                            />
                        <input
                            type="text"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            className='form-control'
                            placeholder='Enter chamber capacity'
                            />
                        <select
                            onChange={(e) => setTag(e.target.value)}
                            value={tag}
                            className='form-control'
                        >
                            <option value='frozen'>Frozen</option>
                            <option value='dry'>Dry</option>
                        </select>
                        <button
                            type='button'
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className='btn btn-primary btn-lg m-0'
                        >
                            Add {isLoading && <Spinner />}
                        </button>
                    </div>

                    {/* Categories List */}
                    <div className="categories-list">
                        <h6 className="mb-3">Existing Chambers</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {categories?.map((chamber, index) => (
                                <div
                                    key={index}
                                    className={`badge ${chamber.tag === 'frozen' ? 'bg-info' : 'bg-success'} d-flex align-items-center gap-2`}
                                    style={{ fontSize: '0.9rem', padding: '8px 12px' }}
                                >
                                    {chamber.chamber_name}
                                    <button
                                        onClick={() => handleDelete(chamber.id)}
                                        className="btn btn-link text-white p-0 ms-2"
                                        type="button"
                                        style={{ fontSize: '1rem', lineHeight: 1 }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {categories?.length === 0 && (
                            <div className="d-flex gap-3 align-items-baseline">
                                {<Spinner />} <p className="text-muted">No chamber found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chamber;