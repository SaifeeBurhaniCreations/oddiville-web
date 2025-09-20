import React, { useState } from 'react'
import { useFormik } from 'formik'
import { validationSchema } from '../../../schemas/SigninForm'
import { LoginService } from '../../../services/AuthService'
import { useNavigate } from 'react-router-dom'
import Spinner from '../Spinner/Spinner'

const Signin = () => {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    // Formik configuration
    const signinForm = useFormik({
        initialValues: {
            email: '',
            userpass: ''
        },
        // validationSchema,
        onSubmit: async(formData) => {
            setIsLoading(true)
            const response = await LoginService(formData)
            if(response.status === 200) {
                setIsLoading(false)
                localStorage.setItem('metadata', response.token)
                navigate('/')
            }   
        }
    })

    return (
        <>
            <main className="main-content mt-0">
                <section>
                    <div className="page-header min-vh-100">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                                    <div className="card card-plain mt-8">
                                        <div className="card-header pb-0 text-left bg-transparent">
                                            <h3 className="font-weight-bolder text-info text-gradient">
                                                Welcome to Oddiville
                                            </h3>
                                            <p className="mb-0">
                                                Enter your email and password to sign in
                                            </p>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={signinForm.handleSubmit} role="form">
                                                
                                                <label>Email</label>
                                                <div className="mb-3">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        aria-label="Email"
                                                        aria-describedby="email-addon"
                                                        value={signinForm.values.email}
                                                        onChange={signinForm.handleChange}
                                                        onBlur={signinForm.handleBlur}
                                                    />
                                                    {signinForm.touched.email && signinForm.errors.email ? (
                                                        <div className="text-danger text-sm">{signinForm.errors.email}</div>
                                                    ) : null}
                                                </div>

                                                <label>Password</label>
                                                <div className="mb-3">
                                                    <input
                                                        type="password"
                                                        name="userpass"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        aria-label="Password"
                                                        aria-describedby="password-addon"
                                                        value={signinForm.values.userpass}
                                                        onChange={signinForm.handleChange}
                                                        onBlur={signinForm.handleBlur}
                                                    />
                                                    {signinForm.touched.userpass && signinForm.errors.userpass ? (
                                                        <div className="text-danger text-sm">{signinForm.errors.userpass}</div>
                                                    ) : null}
                                                </div>

                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="rememberMe"
                                                        id="rememberMe"
                                                    />
                                                    <label className="form-check-label" htmlFor="rememberMe">
                                                        Remember me
                                                    </label>
                                                </div>

                                                <div className="text-center">
                                                    <button
                                                        type="submit"
                                                        className="btn bg-gradient-info w-100 mt-4 mb-0"
                                                    >
                                                        Sign in
                                                        {
                                                            isLoading && <Spinner />
                                                        }
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                                        <div
                                            className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                                            style={{
                                                backgroundImage:
                                                    'url("../assets/img/png/factory.png")',
                                                backgroundSize: 'cover'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Signin;
