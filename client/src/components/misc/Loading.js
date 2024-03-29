import { useSelector } from 'react-redux';
import { Dialog } from './Dialog';

export function Loading() {
  const loading = useSelector((state) => state.loading);
  return (
    <Dialog isOpen={loading} cssClass="loading">
      <img src="./loading.gif" alt="loading" />
    </Dialog>
  );
}
