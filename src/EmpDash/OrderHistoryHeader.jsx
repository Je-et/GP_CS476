import React from 'react'
import './OrderHistoryHeader.css';
import { useNavigate} from 'react-router-dom';
import Logo from '../assets/Logo.png';

// OrderHistoryHeader component renders the header for the Order History page
const OrderHistoryHeader = () => {


    // useNavigate hook from react-router-dom to navigate programmatically
    const navigate = useNavigate()


        // Function to navigate back to the previous page
    const goBack = () => {
        navigate(-1);
    }

    // Function to handle user logout
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