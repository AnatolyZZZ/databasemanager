import '../components/styles/HotKeys.css'
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const HotKeys = (props) => {
    return <div className="hot-keys-page">
        <Link to='/' className='hot-keys-page__home'><ArrowBack/> Back</Link>
        <h2 className="hot-keys-page__title">Use folowing:</h2>
        
        <p className="hot-keys-page-line">
            <span className="hot-keys-page__key">mouse DoubleClick</span>
            <span className="hot-keys-page__text">to start edditing any cell <b className='hot-keys-page__text_bold'>if you are not in edit mode!</b></span>
        </p>
        <p className="hot-keys-page-line">
            <span className="hot-keys-page__key">focus + Enter</span>
            <span className="hot-keys-page__text">to start edditing any cell <b className='hot-keys-page__text_bold'>if you are not in edit mode!</b></span>
        </p>
        <p className="hot-keys-page-line">
            <span className="hot-keys-page__key">return focus to currently eddititing cell + <b>Esc</b></span>
            <span className="hot-keys-page__text">to exit edit mode without saving</span>
        </p>
        <p className="hot-keys-page-line">
            <span className="hot-keys-page__key">return focus to currently eddititing cell  + <b>Tab</b></span>
            <span className="hot-keys-page__text">to save changes <i>(and exit editmode)</i> and go to next cell to the right</span>
        </p>
        <p className="hot-keys-page-line">
            <span className="hot-keys-page__key">return focus to currently eddititing cell + <b>Enter</b></span>
            <span className="hot-keys-page__text">to save changes <i>(and exit editmode)</i>  and go to next cell down</span>
        </p>
    </div>
}