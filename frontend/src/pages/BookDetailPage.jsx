import React from 'react';
import { useParams } from 'react-router-dom';
import BookDetail from '../components/BookDetail';
import Reviews from '../components/Reviews';

const BookDetailPage = () => {
  const { id } = useParams();

  return (
    <>
      <BookDetail />
      <Reviews bookId={id} />
    </>
  );
};

export default BookDetailPage;
