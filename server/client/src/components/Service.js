import {Button} from '@mui/material';
import { useSelector } from 'react-redux';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

const genRows = (num) => {
    const rows = new Array (num);
    for (let i = 0; i < num; i++) {
        const row = {};
        for (let j = 1; j<6; j++) {
            row[`val${j}`] = Math.floor(Math.random() * 1500000)
        }
        for (let j = 6; j<21; j++) {
            row[`val${j}`] = generateRandomString(50);
        }
        rows[i] = row;
    }
    return rows
}

export const Service = (props) => {
    const root_url = useSelector(state => state.root_url);

    const insertInto = async () => {
        for (let i = 0; i < 1; i++) {
            const rows = genRows(100);
            console.log(`generated ${i+1}`)
            const para = {
                method : 'POST',
                headers : {'Content-type' : 'application/json'},
                body : JSON.stringify(
                    {
                        table : 'bigtable',
                        rows : rows
                    }
                )
            }
            try {
                const res = await fetch(`${root_url}/api/table`, para);
                console.log(`status of ${i+1} => `,res.status)
                await delay(100)
            } catch (error) {
                console.log(error)
            }
            
        }
        
    }

    return <div className='container'>
        <Button 
            id='generate_big_table'
            variant="contained"
            onClick={() => insertInto()} >
            Generate
        </Button>
    </div>
}