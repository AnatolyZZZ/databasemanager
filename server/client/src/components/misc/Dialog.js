import {useEffect, useRef} from 'react';
import './misc.css'
export const Dialog = ({isOpen, children, cssClass}) => {
    const dialogRef = useRef(null);
    useEffect ( () => {
        isOpen ? dialogRef.current.open = true : dialogRef.current.open = false
        return () => dialogRef.current.open = false
    }, [isOpen])
    return <dialog ref={dialogRef} className={cssClass}>
        {children}
    </dialog>
}