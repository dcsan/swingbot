import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return(
    <div className='header-bar'>
      <Link className='header-link' to='/'>top</Link>
      <Link className='header-link' to='/graph'>graph</Link>
      <Link className='header-link' to='/live'>live</Link>
    </div>
  )
}

export default Header