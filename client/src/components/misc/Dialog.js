import {useEffect, useRef} from 'react';
import './misc.css'
export const Dialog = ({isOpen, children, cssClass}) => {
    const dialogRef = useRef(null);
    useEffect ( () => {
        const node = dialogRef.current;
        // console.log(`isOpen changed to ${isOpen}`)
        isOpen ? node.open = true : node.open = false
        return () => node.open = false
    }, [isOpen])
    return <dialog ref={dialogRef} className={cssClass}>
        {children}
    </dialog>
}