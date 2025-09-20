import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { create, modify } from '../../../../services/LaneService'
import Spinner from '../../../shared/Spinner/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { handleModifyData, handlePostData } from '../../../../redux/LaneDataSlice'


const AddLane = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const param = useParams()
  const { id } = param;

  const lanes = useSelector(state => state.lane.data)


  const [isLoading, setIsLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
  })  

  const form = useFormik({
    initialValues,
    onSubmit: async (formData) => {
      
      setIsLoading(true);
      try {
        if (!id) {
          const response = await create(formData);
          if (response.status === 201) {
            dispatch(handlePostData(response.data));
            form.resetForm()
            navigate('/lane');
            toast.success('lane is Added !!');
          } else {
            toast.error(response.data.error);
          }
        } else {
          const response = await modify({ formData, id });
          if (response.status === 200) {
            dispatch(handleModifyData(response.data));
            navigate('/lane');
            form.resetForm()
            toast.success('lane is Updated !!');
          } else {
            toast.error(response.data.error);
          }
        }
      } catch (error) {
        toast.error('An error occurred while processing the lane.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    if (id) {
      const data = lanes?.find(value => value.id === id)
      form.setValues(data)
    }
  }, [id])

  const handleExit = () => {
    form.setValues({name: '', description: ''})
    navigate('/lane')
  }

  return (
    <>
        <form onSubmit={form.handleSubmit}>
          <div className="card">
              <div className="card-header flex-cs gap-2 justify-content-between pt-4 pb-2">
                <h6>Manage Work Locations</h6>
                {
                  id && <button type='button' onClick={handleExit} className='btn btn-secondary btn-md m-0'>Clear</button>
                }
              </div>
              <div className="card-body pb-4">
                <div className="grid-cs gtc-1">
                  <div>
                    <input type="text" value={form?.values?.name} onChange={form.handleChange} className="form-control" name="name" placeholder="Lane Name" id="" />
                  </div>
                  <div>
                    <input type="text" value={form?.values?.description} onChange={form.handleChange} className="form-control" name="description" placeholder="Lane Description" id="" />
                  </div>
                </div>
              </div>
              <div className="card-footer ">
                <button type='submit' disabled={isLoading} className='btn btn-primary btn-md m-0'>{id ? 'Update' : 'Save'} Lane {isLoading && <Spinner />}</button>
            </div>
          </div>
        </form>
    </>
  )
}

export default AddLane