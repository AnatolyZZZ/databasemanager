import { useEffect, useRef } from 'react';
import './misc.css';

export function Dialog({ isOpen, children, cssClass }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const node = dialogRef.current;
    isOpen ? node.open = true : node.open = false;
    return () => { node.open = false; };
  }, [isOpen]);
  return (
    <dialog ref={dialogRef} className={cssClass}>
      {children}
    </dialog>
  );
}
