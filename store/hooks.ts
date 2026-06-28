import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

// Typed versions of the redux hooks — use these throughout the app.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
