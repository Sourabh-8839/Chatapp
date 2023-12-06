import React from 'react';

const ImageMessages = ({ format, src }) => {
  return (
    <>
      <img
        style={{ width: '300px', height: '200px', objectFit: 'content' }}
        src={src}
        alt={''}
      />
    </>
  );
};

export default ImageMessages;
