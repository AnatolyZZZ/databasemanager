import {useEffect, useRef} from 'react';
export const Modal = ({isOpen, children, buttonName}) => {
    const dialogRef = useRef(null);
    useEffect ( () => {
        isOpen ? dialogRef.current.showModal() : dialogRef.current.close()
        return () => dialogRef.current.close()
    }, [isOpen])
    return <dialog ref={dialogRef}>
        {children}
        <button onClick={(e) => dialogRef.current.close}>{buttonName}</button>
    </dialog>
}