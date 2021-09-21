import React from 'react'
const loader = require('assets/images/brand/loader-gif.gif')

export default function Loader() {
  return (

    <div className="sk-double-bounce loader">
    <img
      src={loader}
      style={{height:'100px'}}
      alt=''
    ></img>
  </div>
  
  )
}
