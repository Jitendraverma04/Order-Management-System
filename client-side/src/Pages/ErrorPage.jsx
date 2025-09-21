import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div>
      <div className="container" style={{textAlign:"center",marginTop:"12rem"}}>
      <h1>Error 404</h1>
      <h2>Page Not Found</h2><br/>
      <Link to="/">
      <button type='submit' className='btn btn-primary'>Go Back</button>
      </Link>
      </div>
    </div>
  )
}
