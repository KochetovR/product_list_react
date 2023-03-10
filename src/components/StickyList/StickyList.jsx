import  { useState, useEffect, createContext, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import axios from 'axios'
import ListItem from '../ListItem/ListItem';
import "./styles.css";

const StickyList = () => {
    const [products, setProducts] = useState([])
    const StickyListContext = createContext();
    const [favoriteProducts, setFavoriteProducts] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchError, setIsFetchError] = useState(false)

    useEffect(() => {
        axios.get('https://testbackend.nc-one.com/image').then(({data}) => {
            setIsFetching(false)
            setProducts(data)
        }).catch( error => {
            setIsFetchError(true)
            console.log(error);
        })
      }, [])

    useEffect(() => {
        setFavoriteProducts(products[1])
    }, [products])

    StickyListContext.displayName = "StickyListContext";

    const ItemWrapper = ({ data, index, style }) => {
    const { ItemRenderer, stickyIndices } = data;
    if (stickyIndices && stickyIndices.includes(index)) {
        return null;
    }
    return <ItemRenderer index={index} style={style} />;
    };

    const Row = ({ index, style }) => {
        const item = products[index]
        return (
            <div className="row" style={style}>
               {item ? <ListItem product={item} addToFavorite={addToFavorite} removeFromFavorite={removeFromFavorite}/>: "Loading..."}
            </div>
        )
    };
    const addToFavorite = id => {
        products.forEach(item => {
            if(item.id === id ) {
              return setFavoriteProducts([item])
            }
        })
      }
      
      const removeFromFavorite = id => {
        setFavoriteProducts(prevState => prevState.filter(item => item.id !== id))
        // setFavoriteProducts(prevState => console.log(prevState))
      }

    const StickyRow = ({ style, product }) => {
        <div className="sticky" style={style}>
            <ListItem product={product} addToFavorite={addToFavorite} removeFromFavorite={removeFromFavorite}/>
        </div>
    };

    const innerElementType = forwardRef(({ children, ...rest }, ref) => (
    <StickyListContext.Consumer>
        {({ stickyIndices }) => (
            stickyIndices.length > 0 ? 
        <div ref={ref} {...rest}>
            {stickyIndices?.map(product => (
            <StickyRow
                key={product}
                product={product}
                style={{ top: product * 35, left: 0, width: "100%", height: 35 }}
            />
            ))}

            {children}
        </div>
        : null
        )}
    </StickyListContext.Consumer>
    ));

    const StickyList = ({ children, stickyIndices, ...rest }) => (
    <StickyListContext.Provider value={{ ItemRenderer: children, stickyIndices }}>
        <List itemData={{ ItemRenderer: children, stickyIndices }} {...rest}>
        {ItemWrapper}
        </List>
    </StickyListContext.Provider>
    );
        
    return (
        <StickyList
            height={1000}
            innerElementType={innerElementType}
            itemCount={products.length}
            itemSize={155}
            stickyIndices={favoriteProducts}
            width={1000}
        >
            {Row}
        </StickyList>
    )
}

export default StickyList;