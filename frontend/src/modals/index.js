import { Link } from 'react-router-dom';
import './index.css'
import { useState } from 'react';

function Modals(props) {

return (
    <>
    <div className="modal-overlay">
    <div className={props.class}>
        {props.children}
    </div>
    </div>
    </>
  );
}

export default Modals;