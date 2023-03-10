import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { IconContext } from "react-icons";

import s from './ListItem.module.css'

export default function ListItem({ product, addToFavorite, removeFromFavorite }) {
    const [isFavorite, setIsFavorite] = useState(false)
    const handleAddToFavoriteClick = () => {
        setIsFavorite(true)
        addToFavorite( product.id)
    }
    const handleRemovefromFavoriteClick = () => {
        setIsFavorite(false)
        removeFromFavorite( product.id)
    }
    return (
        <>
            <img src={`https://testbackend.nc-one.com${product.src}`} alt={product.name} width={50} className={s.avatar} />
            <div>
                <p className={s.info}>Product name: <span>{product.name}</span></p>
                <p className={s.info}>Price: <span>${product.price}</span></p>
                <button type='button' className={s.viewMoreButton}>
                    <Link to={`product?id${product.id}`} state={{id: product.id}}>
                        view more
                    </Link>
                </button>
                {isFavorite ? 
                    <button type='button' onClick={handleRemovefromFavoriteClick} className={s.addToFavoriteButton}>remove from favorite</button> 
                    :
                    <button type='button' onClick={handleAddToFavoriteClick} className={s.addToFavoriteButton}>add to favorite</button>
                }
            </div>
            {isFavorite
                ?
                    <IconContext.Provider  value={{ className: s.reactIcons }}>
                        <MdFavorite size={25} color='orange' />
                    </IconContext.Provider>
                :
                    <IconContext.Provider  value={{ className: s.reactIcons }}>
                        <MdFavoriteBorder size={25} color='orange' />
                    </IconContext.Provider>
            }
        </>
    )
}