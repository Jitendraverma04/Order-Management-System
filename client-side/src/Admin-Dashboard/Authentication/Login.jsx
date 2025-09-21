import React,{useContext} from 'react'
import { useForm } from 'react-hook-form';
// import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";



export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
      const r = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      const res = await r.json()
      if (res.token) {
        localStorage.setItem("Token", res.token);
    } 
    if (r.status === 200) {
        navigate("/my-system/admin/dashboard");
         (toast.success("Login Successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }));
    }
    if (r.status === 401) {
      toast.warn(res, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (r.status === 404) {
      toast.error(res, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } if (r.status === 500) {
      toast.error(res, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

  }

  const registerOptions = {
    name: { required: "Name is required" },
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters"
      }
    }
  };

  return (
    <div>

      <div className="card" style={{ width: "20rem", margin: "120px auto",height:"50vh" }}>
        <div className="card-body" style={{margin:"3rem 0px"}}>
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-2">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" id="Email" aria-describedby="emailHelp"  {...register('email', registerOptions.email)} />
              <small className="text-danger">
                {errors?.email && errors.email.message}
              </small>
            </div>
            <div className="mb-4">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="Password"
                name="password"
                {...register('password', registerOptions.password)} />
              <small className="text-danger">
                {errors?.password && errors.password.message}
              </small>
            </div>

            <div className="mb-3">

              <button type="submit" className="btn btn-primary" style={{ margin: "0 100px" }}>Login</button>

            </div>

            {/* <div className="mb-3">
              <h5>Don't have an account ?</h5>
              <Link to="/register" style={{textDecoration:"none"}}>Register</Link>
            </div> */}
          </form>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" />
        </div>
      </div>

    </div>
  )
}
