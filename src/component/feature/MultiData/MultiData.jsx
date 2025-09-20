import { useNavigate } from 'react-router-dom'

const MultiData = () => {

    const navigate = useNavigate()

    return (
        <>
            <div className="container-fluid p-5">
                <div className="row g-4">
                    <div className="col-md-12">
                        <div className="flex-cs header p-3">
                            <h3>Dashboard</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div onClick={()=>navigate('/dry-warehouse')} className="card cursor-pointer">
                            <div className="card-header justify-content-center flex-cs pt-4 pb-2">
                                <h5>Manage Dry Chamber</h5>
                            </div>
                            <div className="card-body flex-cs pt-2">
                                <img src="./assets/img/svg/warehouse.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div onClick={()=>navigate('/lane')} className="card cursor-pointer">
                            <div className="card-header justify-content-center flex-cs pt-4 pb-2">
                                <h5>Manage Machines</h5>
                            </div>
                            <div className="card-body flex-cs pt-2">
                                <img src="./assets/img/svg/machine.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div onClick={()=>navigate('/work-location')} className="card cursor-pointer">
                            <div className="card-header justify-content-center flex-cs pt-4 pb-2">
                                <h5>Manage Locations</h5>
                            </div>
                            <div className="card-body flex-cs pt-2">
                                <img src="./assets/img/svg/location.svg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div onClick={()=>navigate('/raw-material')} className="card cursor-pointer">
                            <div className="card-header justify-content-center flex-cs pt-4 pb-2">
                                <h5>Manage Raw material</h5>
                            </div>
                            <div className="card-body flex-cs pt-2">
                                <img src="./assets/img/svg/raw-material.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiData