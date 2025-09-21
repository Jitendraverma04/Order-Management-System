import React from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


export default function Register() {

  const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async(data) => {
  const response=await fetch(`${import.meta.env.VITE_SERVER_URL}/register`,{method: "POST",
  headers: {
    "Content-Type": "application/json", 
  },
  body: JSON.stringify(data)})

  const res=await response.json()
  localStorage.setItem("Token", res.token);

  if (response.status === 200) {
    navigate("/my-system/admin/dashboard");
    toast.success("Sign Up Successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  }
  if (response.status === 401) {
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
 
   if (response.status === 500) {
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
      
      <div className="card" style={{width:"20rem",margin:"100px auto",height:"58vh"}}>
  <div className="card-body">
  <form onSubmit={handleSubmit(onSubmit)}>

  <div className="mb-3">
    <label  className="form-label">Name</label>
    <input className="form-control" id="Name" aria-describedby="nameHelp" type="text" {...register('name', registerOptions.name) }/>
    <small className="text-danger">
          {errors?.name && errors.name.message}
        </small>
  </div>

  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="Email" aria-describedby="emailHelp"  {...register('email', registerOptions.email) }/>
    <small className="text-danger">
          {errors?.email && errors.email.message}
        </small>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="Password"
          name="password"
          {...register('password', registerOptions.password)}/>
    <small className="text-danger">
          {errors?.password && errors.password.message}
        </small>
  </div>

<div className="mb-3">

<button type="submit" className="btn btn-primary" style={{margin:"0 100px"}}>Submit</button>

</div>
  <div className="mb-3">
  <h5>Already have an account ?</h5>
  {/* <Link to="/login" style={{textDecoration:"none"}} >Login</Link> */}
  </div>
</form>
<ToastContainer
 position="top-center"
 autoClose={2000}
 hideProgressBar={false}
 newestOnTop={false}
 closeOnClick
 rtl={false}
 pauseOnFocusLoss
 draggable
 pauseOnHover
 theme="light"/>
  </div>
</div>

    </div>
  )
}