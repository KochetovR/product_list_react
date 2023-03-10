import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";

import s from './RepoInfo.module.css'

export default function RepoInfo() {
    const [product, setProduct] = useState([])

    const location = useLocation();
    const id = location.state.id
    const historyParam = location.state ? location.state.prevSearchValue : '';
    

    useEffect(() => {
        axios.get(`https://testbackend.nc-one.com/image?id=${id}`).then( ({data}) => {
            setProduct(data)
        }).catch( error => {
            console.log(error);
        })
    },[id])
    

    const navigate = useNavigate ();

    const onClickGoBack = () => {
        navigate('/', {state: {prevSearch: historyParam}})
    };


    return (
        <div className={s.product}>
                <img className={s.avatar} src={`https://testbackend.nc-one.com${product.src}`} alt={product.name} />
                <p>Product name: {product.name}</p>
                <p>Price: ${product.price}</p>
            <button onClick={onClickGoBack} className={s.backButton}>Назад</button>
        </div>
    )
}