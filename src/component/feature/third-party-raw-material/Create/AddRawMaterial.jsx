import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { create, modify } from '../../../../services/ThridPartyProductService';
import { fetchChamber } from '../../../../services/DryChamberService';
import Spinner from '../../../shared/Spinner/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { handleModifyData, handlePostData } from '../../../../redux/WorkLocationSlice';
import Banners from '../../../shared/Banners/Banners';

const AddRawMaterial = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const chambers = useSelector(state => state.ServiceDataSlice.chamber);
  const workLocation = useSelector(state => state.location.data);

  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState(null);
  const [fetchedBanners, setFetchedBanners] = useState(null);
  const [deleteBanners, setDeleteBanners] = useState(null);
  const [productList, setProductList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [newProduct, setNewProduct] = useState({
    product_name: '',
    est_dispatch_date: '',
    rent: '',
    selectedChambers: [],
  });


  const clientForm = useFormik({
    initialValues: {
      name: '',
      company: '',
      address: '',
      phone: '',
      products: [],
      sample_image: null,
    },
    onSubmit: async (values) => {
      const formPayload = new FormData();
      formPayload.append('name', values.name);
      formPayload.append('company', values.company);
      formPayload.append('address', values.address);
      formPayload.append('phone', values.phone);
      formPayload.append('products', JSON.stringify(values.products));
      formPayload.append('sample_image', banners)

      setIsLoading(true);

      try {
        const response = id
          ? await modify({ formData: formPayload, id })
          : await create(formPayload);

        if (response.status === 200 || response.status === 201) {
          dispatch(id ? handleModifyData(response.data) : handlePostData(response.data));
          toast.success(id ? 'Updated successfully!' : 'Added successfully!');
          navigate('/raw-material-other');
        } else {
          toast.error('Failed to save client.');
        }
      } catch (error) {
        toast.error('Error while saving client.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const toggleChamber = (chamberId) => {
    setNewProduct((prev) => {
      const exists = prev.selectedChambers.some(c => c.id === chamberId);
      if (exists) {
        return {
          ...prev,
          selectedChambers: prev.selectedChambers.filter(c => c.id !== chamberId)
        };
      } else {
        return {
          ...prev,
          selectedChambers: [...prev.selectedChambers, { id: chamberId, quantity: '' }],
        };
      }
    });
  };

  const updateQuantity = (chamberId, qty) => {
    setNewProduct((prev) => ({
      ...prev,
      selectedChambers: prev.selectedChambers.map(ch =>
        ch.id === chamberId ? { ...ch, quantity: qty } : ch
      ),
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'sample_image') {
      setNewProduct(prev => ({ ...prev, sample_image: files[0] || null }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const addProductToList = () => {
    if (!newProduct.product_name) {
      toast.error('Product name is required');
      return;
    }
    setProductList((prev) => {
      const newList = [...prev, newProduct];
      clientForm.setFieldValue('products', newList);
      return newList;
    });
    setNewProduct({
      product_name: '',
      est_dispatch_date: '',
      rent: '',
      selectedChambers: [],
      sample_image: null,
    });
    setFetchedBanners(null);
    setDeleteBanners(null);
  };

  useEffect(() => {
    if (id) {
      const data = workLocation?.find(v => v.id === id);
      if (data) {
        clientForm.setValues({
          name: data.name,
          address: data.address,
          phone: data.phone,
          products: data.products || [],
        });
        setProductList(data.products || []);
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const chamberRes = await fetchChamber();
        if (chamberRes.status === 200) {
          dispatch({
            type: "ServiceDataSlice/handleFetchCategory",
            payload: chamberRes.data,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    chambers?.length === 0 ? fetchAll() : setIsLoading(false);
  }, [dispatch]);

  const fetchBanners = (img) => setBanners(img);

  // console.log(banners);
  

  const handleEditProduct = (index) => {
    const item = productList[index];
    productForm.setValues({
      product_name: item.product_name,
      rent: item.rent,
      est_dispatch_date: item.est_dispatch_date,
      selectedChambers: item.selectedChambers,
    });
    setBanners(item.sample_image || null);
    setEditIndex(index);
  };

  const handleDeleteProduct = (index) => {
    const updated = [...productList];
    updated.splice(index, 1);
    setProductList(updated);
    clientForm.setFieldValue('products', updated);
  };

  return (
    <div className="container">
      {/* Client Form */}
      <div className="row">
        <div className="col-md-4">
          <form className="card" onSubmit={clientForm.handleSubmit}>
            <div className="card-header d-flex justify-content-between">
              <h6>Client Details</h6>
              <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm">
                Save All {isLoading && <Spinner />}
              </button>
            </div>
            <div className="card-body">
              <input
                name="name"
                className="form-control mb-2"
                placeholder="Client Name"
                value={clientForm.values.name}
                onChange={clientForm.handleChange}
              />
              <input
                name="company"
                className="form-control mb-2"
                placeholder="Company Name"
                value={clientForm.values.company}
                onChange={clientForm.handleChange}
              />
              <input
                name="address"
                className="form-control mb-2"
                placeholder="Address"
                value={clientForm.values.address}
                onChange={clientForm.handleChange}
              />
              <input
                name="phone"
                className="form-control"
                placeholder="Phone"
                value={clientForm.values.phone}
                onChange={clientForm.handleChange}
              />
              {/* Optionally display list of added products here */}
              {productList.length > 0 && (
                <div className="mt-3">
                  <h6>Products added:</h6>
                  <ul>
                    {productList.map((prod, idx) => (
                      <li key={idx}>{prod.product_name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6>Add Product</h6>
            </div>
            <div className="card-body">
              <Banners
                name="Upload Image"
                getBanners={fetchedBanners}
                deleteBanners={deleteBanners}
                setDeleteBanners={setDeleteBanners}
                fetchBanners={fetchBanners}
                onFileChange={e => {
                  const file = e.target.files[0];
                  clientForm.setFieldValue('sample_image', file);
                  setNewProduct(prev => ({ ...prev, sample_image: file }));
                }}
              />
              <input
                className="form-control mb-2"
                name="product_name"
                placeholder="Product Name"
                value={newProduct.product_name}
                onChange={handleProductInputChange}
              />
              <input
                className="form-control mb-2"
                name="rent"
                placeholder="Rent per Kg"
                value={newProduct.rent}
                onChange={handleProductInputChange}
              />
              <input
                type="date"
                className="form-control mb-2"
                name="est_dispatch_date"
                value={newProduct.est_dispatch_date}
                onChange={handleProductInputChange}
              />
              <label>Select Chambers</label>
              {chambers?.filter(c => c.tag === 'frozen')?.map(chamber => (
                <div key={chamber.id} className="d-flex align-items-center mb-2">
                  <input
                    type="checkbox"
                    checked={newProduct.selectedChambers.some(c => c.id === chamber.id)}
                    onChange={() => toggleChamber(chamber.id)}
                    className="me-2"
                  />
                  <span className="me-3">{chamber.chamber_name}</span>
                  {newProduct.selectedChambers.some(c => c.id === chamber.id) && (
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={newProduct.selectedChambers.find(c => c.id === chamber.id)?.quantity || ''}
                      onChange={e => updateQuantity(chamber.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-success mt-3" onClick={addProductToList}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      {productList.length > 0 && (
        <div className="card mt-4">
          <div className="card-header"><h6>Products List</h6></div>
          <div className="card-body table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dispatch Date</th>
                  <th>Rent/Kg</th>
                  <th>Chambers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((prod, i) => (
                  <tr key={i}>
                    <td>{prod.product_name}</td>
                    <td>{prod.est_dispatch_date}</td>
                    <td>{prod.rent}</td>
                    <td>
                      {prod.selectedChambers.map(c => (
                        <div key={c.id}>ID: {c.id}, Qty: {c.quantity}</div>
                      ))}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditProduct(i)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(i)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRawMaterial;
