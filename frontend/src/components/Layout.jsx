import React, {useState} from 'react'
import {styles} from '../assets/dummyStyles'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({onLogout, user, setUser}) => {
  const [sidebarCollapsed, setsidebarCollapsed] = useState(false);
  return (
    <div className={styles.layout.root}>
      <Navbar user={user} setUser={setUser} onLogout={onLogout}/>
      <Sidebar user={user} 
      isCollapsed = {sidebarCollapsed} 
      setIsCollapsed={setsidebarCollapsed}/>
    </div>
  )
}

export default Layout
