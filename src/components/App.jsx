import Searchbar from './Searchbar/Searchbar';
import ImageGalery from './ImageGallery/ImageGallery';
import { GetImages } from './Servises/servises';
import styled, { createGlobalStyle } from 'styled-components';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
  width: 100vw;
  overflow-x: hidden;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  color: #212121;
  background-color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}`;
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

const App = () => {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const [alt, setAlt] = useState('');

  const getUserValue = value => {
    setValue(value);
  };

  const getNextImages = () => {
    const newPage = page + 1;

    setVisible(true);

    GetImages(value, newPage)
      .then(resp => {
        setItems(prev => [...prev, ...resp.hits]);
        setVisible(false);
        setPage(newPage);
      })
      .catch(error => setError(error));
  };

  const getLargeImage = (dataUrl, alt) => {
    setDataUrl(dataUrl);
    setAlt(alt);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (value.trim() !== '') {
      setPage(1);
      setVisible(true);

      GetImages(value)
        .then(resp => {
          setItems(resp.hits);
          setVisible(false);
        })
        .catch(error => setError(error.message));
    }
  }, [value]);

  return (
    <StyledDiv>
      <GlobalStyle />
      <Searchbar getUserValue={getUserValue} />
      <Loader visible={visible} />
      <ImageGalery items={items} getLargeImage={getLargeImage} />
      {items.length > 0 && <Button getNextImages={getNextImages} />}
      {showModal && (
        <Modal dataUrl={dataUrl} alt={alt} toggleModal={toggleModal} />
      )}
      {error && <div>{error}</div>}
    </StyledDiv>
  );
};

App.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      previewURL: PropTypes.string,
      tags: PropTypes.string,
      largeImageURL: PropTypes.string,
    })
  ),
  value: PropTypes.string,
  page: PropTypes.number,
  visible: PropTypes.bool,
  showModal: PropTypes.bool,
  dataUrl: PropTypes.string,
  alt: PropTypes.string,
  getUserValue: PropTypes.func,
  getLargeImage: PropTypes.func,
  getNextImages: PropTypes.func,
  toggleModal: PropTypes.func,
};

export default App;
