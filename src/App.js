import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import './App.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(
        `https://api.unsplash.com/photos/?page=${page}&client_id=KfK-www_9C1X7kwamnGlIzR2un-iVUh99h8Q2fFjQqE`
      )
      .then(response => {
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setPhotos([...photos, ...response.data]);
        }
      });
  }, [page]);

  const handleScroll = () => {
    if (
      parseInt(window.innerHeight) + parseInt(document.documentElement.scrollTop) ===
      parseInt(document.documentElement.offsetHeight) &&
      hasMore
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, hasMore]);

  const handleLightboxOpen = (photo) => {
    setSelectedPhoto(photo);
    setCurrentIndex(photos.indexOf(photo));
  };

  const handleLightboxClose = (direction) => {
    if (direction === "left") {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right") {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSelectedPhoto(null);
    }

    if (currentIndex < 0) {
      setCurrentIndex(photos.length - 1);
    } else if (currentIndex >= photos.length - 1) {
      setCurrentIndex(0);
    }
  };

  const swipeableHandlers = useSwipeable({
    onSwipedLeft: () => handleLightboxClose("right"),
    onSwipedRight: () => handleLightboxClose("left")
  });

  return (
    <>
      <div className="grid">
        {photos.map(photo => (
          <div key={photo.id} className="grid-item">
            <img
              src={photo.urls.small}
              alt={photo.alt_description}
              onClick={() => handleLightboxOpen(photo)}
            />
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <Lightbox
          photo={photos[currentIndex]}
          close={handleLightboxClose}
          {...swipeableHandlers}
        />
      )}
    </>
  );
};

const Lightbox = ({ photo, close, ...swipeableHandlers }) => (
  <div className="lightbox">
    <div className="lightbox-content">
      <img src={photo.urls.full} alt={photo.alt_description} />
      <div className="lightbox-info">
        <p>
          <strong>Author:</strong>{" "}
          <a href={photo.user.links.html}>
            {photo.user.name}
          </a>
        </p>
        <p>
          <strong>Description:</strong> {photo.alt_description}
        </p>
      </div>
    </div>
    <button
      onClick={() => close("left")}
      className="lightbox-arrow lightbox-arrow-left"
    >
      {"<"}
    </button>
    <button
      onClick={() => close("right")}
      className="lightbox-arrow lightbox-arrow-right"
    >
      {">"}
    </button>
    <button onClick={close} className="lightbox-close">
      Close
    </button>
  </div>
);
export default App;