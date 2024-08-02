import React from 'react'
import './OrderHistoryHeader.css';
import { useNavigate} from 'react-router-dom';
import Logo from '../assets/Logo.png';

const OrderHistoryHeader = () => {

    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1);
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      };

    return (
        <header className="header">
            <div className="logo">

                    <img src={Logo} alt="Logo" className="header-logo" />

            </div>
            <div className="vertical_line"></div>
            <div className="title"> GreenBasket</div>
            <div className="vertical_line"></div>
            <div className="profile-cart">

                <button onClick={() => goBack()} className="btn">Dashboard</button>
                <div className="logout" onClick={handleLogout}>Log Out</div>
            </div>
        </header>
    )
}

export default OrderHistoryHeader