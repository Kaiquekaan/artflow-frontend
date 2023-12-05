import React from "react";
import './Loadingalt.css'


const Loadingalt = () => {
    return (
        <div>
         <div className='page-overlay'></div>
        <div className="loading-container">
            <div class="d-flex justify-content-center">
            <div class="spinner-border"role="status">
            <span class="sr-only">Loading...</span>
        </div>
        </div>
        </div>
        </div>
    );
}
export default Loadingalt;