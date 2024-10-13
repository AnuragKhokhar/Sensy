
import React, { useRef, useEffect, useState } from 'react';

const ProfilePhotoModal = ({ open, toggleModal, imageUrl }) => {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      toggleModal();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, toggleModal]);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div ref={modalRef} className="bg-white rounded-lg p-4 transition-transform duration-1000 transform scale-100 w-[400px] h-[400px]">
            <img src={imageUrl} alt="Profile Photo" className="w-full h-full" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePhotoModal;
