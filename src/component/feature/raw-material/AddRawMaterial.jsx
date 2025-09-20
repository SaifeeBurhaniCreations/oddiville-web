import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { createRawMaterial, modifyRawMaterial } from '../../../services/RawMaterialService'
import Spinner from '../../shared/Spinner/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { handleModifyData, handlePostData } from '../../../redux/RawMaterialDataSlice'
import Banners from './Banners'

const AddWorkLocation = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const param = useParams()
  const { id } = param;

  const rmData = useSelector(state => state.rm.data)


  const [isLoading, setIsLoading] = useState(false)
  const [banners, setBanners] = useState()
  const [fetchedBanners, setFetchedBanners] = useState()
  const [deleteBanners, setDeleteBanners] = useState()
  const [initialValues, setInitialValues] = useState({
    name: '',
    sample_image: null
  })  

  const form = useFormik({
    initialValues,
    onSubmit: async (formData) => {
      
      const formPayload = new FormData();

      // Add basic fields
      formPayload.append("name", formData.name);


      // Add sample_image_url if exists
      if (banners) {
        formPayload.append("sample_image", banners);
      }

       // Log the formPayload
      // const payloadObject = {};
      // formPayload.forEach((value, key) => {
      //   payloadObject[key] = value;
      // });
      // console.log("Form Payload:", payloadObject); // Log the payload

      // return

      setIsLoading(true);
      try {
        if (!id) {
          const response = await createRawMaterial(formPayload);
          if (response.status === 201) {
            form.resetForm()
            setBanners(null)
            dispatch(handlePostData(response.data));
            navigate('/raw-material');
            toast.success('raw material is Added !!');
          } else {
            toast.error('Failed to create raw material.');
          }
        } else {
          // Add deleteBanner flag if updating
          // if (deleteBanner) {
          //   formPayload.append("deleteBanner", "true");
          // }

          const response = await modifyRawMaterial({ formData: formPayload, id });
          if (response.status === 200) {
            dispatch(handleModifyData(response.data));
            navigate('/raw-material');
            toast.success('raw material is Updated !!');
          } else {
            toast.error('Failed to update raw material.');
          }
        }
      } catch (error) {
        toast.error('An error occurred while processing the raw material.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    if (id) {
      const data = rmData?.find(value => value.id === id)
      form.setValues(data)
      setFetchedBanners(data?.sample_image)
    }
  }, [id])

  const fetchBanners = (data) => {
    setBanners(data)
  }

  const handleExit = () => {
    setFetchedBanners(null)
    form.setValues({name: '', sample_image: null})
    navigate('/raw-material')
  }


  return (
    <>
        <form onSubmit={form.handleSubmit}>
          <div className="card">
            <div className="card-header flex-cs gap-2 justify-content-between pt-4 pb-2">
              <h6>Manage Raw Materials</h6>
              {
                id && <button type='button' className='btn btn-sm btn-secondary' onClick={handleExit}>Clear</button>
              }
            </div>
            <div className="card-body flex-cs justify-content-start gap-2 align-items-end pb-4">
              <Banners name='Uplaod Image' getBanners={fetchedBanners} deleteBanners={deleteBanners} setDeleteBanners={setDeleteBanners} fetchBanners={fetchBanners} />
              <div className="grid-cs gtc-1">
                <div>
                  <input type="text" value={form?.values?.name} onChange={form.handleChange} className="form-control" name="name" placeholder="Item Name" id="" />
                </div>
              </div>
            </div>
            <div className="card-footer">
            <button type='submit' disabled={isLoading} className='btn btn-primary btn-md m-0'>Save Item {isLoading && <Spinner />}</button>
            </div>
          </div>
        </form>
    </>
  )
}

export default AddWorkLocation