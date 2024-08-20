import React from 'react';
import './WantedPoster.css';
import poster from '../../assets/poster/poster.png';

interface WantedPosterProps {
    montage: string;
    isOpen: boolean;
    onClose: () => void;
}

const WantedPoster: React.FC<WantedPosterProps> = ({ montage, isOpen, onClose }) => {
    if (!isOpen || !montage) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
    };

    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
            <div className="wanted-poster" style={{ backgroundImage: `url(${poster})` }}>
              <img src={montage} alt="Wanted Poster" className="poster-image" />
            </div>
        </div>
      </div>
    );
};

export default WantedPoster;