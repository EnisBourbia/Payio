import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'
import './index.css'

function Topbar() {
  return (
    <div className="top-header row">
        <div className="logo-container col-3 offset-1">
            <img src={logo} />
        </div>

    </div>
  );
}

export default Topbar;
