import { useContext } from 'react';
import { useBooks as useBooksContext } from '../context/BookContext';

export const useBooks = () => {
  return useBooksContext();
};