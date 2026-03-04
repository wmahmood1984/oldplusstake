import React, { useEffect, useState } from 'react'
import "./FirstModal.css"

export default function FirstModal() {

     const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const alreadyClosed = localStorage.getItem("STORAGE_KEY");
        if (!alreadyClosed) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("STORAGE_KEY", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;
    return (
        <div>
            <div id="announcementPopup" class="popup-overlay" >
                <div class="popup-container">
                    <button 
                    onClick={()=>{handleClose()}}
                    id="popupCloseButton" class="popup-close-button">
                        ×
                    </button>
                    <div class="announcement-image-container">
                        <img src="Image2.jpeg" alt="Important Announcement" />
                    </div>
                </div>
            </div>

        </div>
    )
}
