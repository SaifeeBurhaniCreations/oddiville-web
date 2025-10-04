

import React from "react";
import Spinner from "@/components/Spinner/Spinner";

const ChamberList = ({ categories, setChamberToDelete, isInitialLoading }) => {

    if (isInitialLoading) {
        return (
            <div className="text-center py-5">
                <Spinner />
                <p className="mt-2 text-secondary">Loading existing chambers...</p>
            </div>
        );
    }
    
    if (!categories || categories.length === 0) {
        return (
            <div className="text-center text-secondary py-4">
                No chamber found
            </div>
        );
    }

    return (
        <div className="categories-list">
            <h6 className="mb-3">Existing Chambers</h6>
            <div className="table-responsive">
                <table className="table table-borderless table-hover mb-0">
                    <thead>
                        <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Capacity (in kgs)</th>
                            <th className="text-center">No. of Items</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((chamber, idx) => (
                            <tr
                                key={idx}
                                className={`text-dark ${
                                    chamber.tag === "dry" ? "is-dry" : "is-frozen"
                                }`}
                            >
                                <td className="text-center p-1">
                                    {chamber.chamber_name}
                                </td>
                                <td className="text-center p-1">
                                    {chamber.capacity} Kgs
                                </td>
                                <td className="text-center p-1">
                                    {chamber?.items?.length ?? "No item"}
                                </td>
                                <td className="text-center p-1 text-capitalize">
                                    {chamber.tag}
                                </td>
                                <td className="text-center p-1">
                                    <button
                                        className="btn btn-link text-dark p-1"
                                        type="button"
                                        onClick={() => setChamberToDelete(chamber)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChamberList;