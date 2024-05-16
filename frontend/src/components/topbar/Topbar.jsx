import React, { useState } from 'react';
import './Topbar.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import 'primeicons/primeicons.css';

const Topbar = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="topbar">
            <div className="logo">
                <img src='../assets/image/car.png' alt="Logo" />
                <div className='webname'>AUTO SERVICE SYSTEM</div>
            </div>

            <div className="login-logout">
                {isLoggedIn ? (
                    <>
                        <Link to="/home"
                            className={location.pathname === '/home' ? 'menu-active' : 'menu'}>
                            หน้าหลัก
                        </Link>
                        <Link to="/history"
                            className={location.pathname === '/history' ? 'menu-active' : 'menu'}>
                            ประวัติการซ่อม
                        </Link>
                        <Link to="/report"
                            className={location.pathname === '/report' ? 'menu-active' : 'menu'}>
                            รายงานสรุป
                        </Link>
                        
                        <div className='user'>
                            <Dropdown show={showDropdown} onToggle={handleDropdownToggle}>
                                <Dropdown.Toggle className='dropdown-toggle' id="dropdown-basic">
                                    <i className="user-icon pi pi-user"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>{localStorage.getItem('username')}</Dropdown.Item>
                                    <Dropdown.Item href="/register">เพิ่มผู้ใช้งาน</Dropdown.Item>
                                    <Dropdown.Item href="/infomanage">จัดการข้อมูล</Dropdown.Item>
                                    <div className='logout' onClick={handleLogout}>Log out</div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className='login-button'>Log in</Link>
                )}
            </div>
        </div>
    );
};

export default Topbar;