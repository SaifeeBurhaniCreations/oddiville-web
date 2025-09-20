import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { create, fetchDryWarehouse, modify } from '../../../../services/DryChamberService'
import Spinner from '../../../shared/Spinner/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { handleModifyData, handlePostData } from '../../../../redux/ServiceDataSlice'
import Chamber from '../Chamber/Chamber'
import Banners from '../../../shared/Banners/Banners'


const CreateService = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const param = useParams()
  const { id } = param;

  const serviceData = useSelector(state => state.ServiceDataSlice.data)
  const chambers = useSelector(state => state.ServiceDataSlice.chamber);


  const [isLoading, setIsLoading] = useState(false)
  const [banners, setBanners] = useState()
  const [fetchedBanners, setFetchedBanners] = useState()
  const [deleteBanners, setDeleteBanners] = useState()
  const [initialValues, setInitialValues] = useState({
    item_name: '',
    chamber_id: '',
    warehoused_date: Date.now(),
    description: '',
    quantity_unit: '',
    sample_image: null
  })

  const form = useFormik({
    initialValues,
    onSubmit: async (formData) => {
      const formPayload = new FormData();

      // Add basic fields
      formPayload.append("item_name", formData.item_name);
      formPayload.append("chamber_id", formData.chamber_id);
      formPayload.append("description", formData.description);
      formPayload.append("quantity_unit", formData.quantity_unit);
      formPayload.append("warehoused_date", formData.warehoused_date);


      // Add sample_image if exists
      if (banners) {
        formPayload.append("sample_image", banners);
      }

      // // Log the formPayload
      // const payloadObject = {};
      // formPayload.forEach((value, key) => {
      //   payloadObject[key] = value;
      // });
      // console.log("Form Payload:", payloadObject); // Log the payload

      // return

      setIsLoading(true);
      try {
        if (!id) {
          const response = await create(formPayload);
          if (response.status === 201) {
            dispatch(handlePostData(response.data));
            navigate('/dry-warehouse');
            toast.success('Item is Added !!');
          } else {
            toast.error('Failed to create service.');
          }
        } else {
          // Add deleteBanner flag if updating
          // if (deleteBanner) {
          //   formPayload.append("deleteBanner", "true");
          // }

          const response = await modify({ formData: formPayload, id });
          if (response.status === 200) {
            dispatch(handleModifyData(response.data));
            navigate('/dry-warehouse');
            toast.success('Item is Updated !!');
          } else {
            toast.error('Failed to update service.');
          }
        }
      } catch (error) {
        toast.error('An error occurred while processing the service.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    if (id) {
      const data = serviceData?.find(value => value.id === id)
      form.setValues(data)
      setFetchedBanners(data?.sample_image)
    }
  }, [id])

  const fetchBanners = (data) => {
    setBanners(data)
  }


  return (
    <>
      <div className="container-fluid">
        <form onSubmit={form.handleSubmit}>
          <div className="row align-items-stretch">
            <div className="col-md-8">
              <div className="grid-cs gtc-1">

                <div className="card">
                  <div className="card-header pt-4 pb-2">
                    <h6>Manage Items</h6>
                  </div>
                  <div className="card-body grid-cs pb-4">
                    <Banners name='Uplaod Item' getBanners={fetchedBanners} deleteBanners={deleteBanners} setDeleteBanners={setDeleteBanners} fetchBanners={fetchBanners} />
                    <div className="grid-cs">
                      <div>
                        <input type="text" value={form?.values?.item_name} onChange={form.handleChange} className="form-control" name="item_name" placeholder="Item Name" id="" />
                      </div>
                      <div>
                        <input type="text" value={form?.values?.description} onChange={form.handleChange} className="form-control" name="description" placeholder="Service Description" id="" />
                      </div>
                      <div>
                        <input type="date" value={form?.values?.warehoused_date} onChange={form.handleChange} className="form-control" name="warehoused_date" id="" />
                      </div>
                      <div>
                        <input type="text" value={form?.values?.quantity_unit} onChange={form.handleChange} className="form-control" name="quantity_unit" placeholder="Item Quantity Unit" id="" />
                      </div>
                      <div>
                        <select
                          name="chamber_id"
                          value={form.values.chamber_id || ''}
                          onChange={form.handleChange}
                          className="form-control"
                          id=""
                        >
                          <option value="">Select Category</option>
                          {chambers?.map((category, index) => {
                            if(category.tag === 'dry') {
                              return (
                                <option value={category.chamber_name} key={index}>{category.chamber_name}</option>
                              )
                            }
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="card">
                  <div className="card-header pt-4 pb-2">
                    <h6>Service Link</h6>
                  </div>
                  <div className="card-body py-2">
                    <div className="my-3">
                      <select
                        name="link.category"
                        value={form.values.chamber_id || ''}
                        onChange={form.handleChange}
                        className="form-control"
                        id=""
                      >
                        <option value="">Select Category</option>
                        {chambers?.map((category, index) => (
                          <option value={category} key={index}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="my-3">
                      <input
                        type="text"
                        value={form.values.link?.name || ''}
                        onChange={form.handleChange}
                        className="form-control"
                        name="link.name"
                        placeholder="Link Name"
                      />
                    </div>
                    <div className="my-3">
                      <input
                        type="text"
                        value={form.values.link?.url || ''}
                        onChange={form.handleChange}
                        className="form-control"
                        name="link.url"
                        placeholder="Link Url"
                      />
                    </div>
                  </div>
                </div> */}

              </div>

            </div>
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-header gtc-1-2  grid-cs">
                  <button type='button' onClick={() => navigate('/dry-warehouse')} className='btn btn-secondary btn-lg m-0'>Exit</button>
                  <button type='submit' disabled={isLoading} className='btn btn-primary btn-lg m-0'>Save {isLoading && <Spinner />}</button>
                </div>
              </div>


              <Chamber />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateService