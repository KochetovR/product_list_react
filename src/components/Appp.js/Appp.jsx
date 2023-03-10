import { useState, useEffect, useRef } from 'react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import throttle from "lodash/throttle";
import InfiniteLoader from "react-window-infinite-loader";

import ListItem from '../ListItem/ListItem';

import "./styles.css";

const Appp = () => {
  const [products, setProducts] = useState([])
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

let items = []
let requestCache = {};


// const getUrl = () => {
//     axios.get('https://testbackend.nc-one.com/image').then(({data}) => {
//         setIsFetching(false)
//         setProducts(data)
//     }).catch( error => {
//         setIsFetchError(true)
//         console.log(error);
//     })
// }

// const Row = ({ index, style }) => {
//     const item = products[index]
//     if (index + 1 >= itemsCount) return null;
//     return (
//   <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
//     {item ? <ListItem product={item} addToFavorite={addToFavorite} removeFromFavorite={removeFromFavorite}/>: "Loading..."}
//   </div>
//     )
// };

const Row = memo( function Row({index, style}) {
  const item = products[index]
  if (index + 1 >= products.length) return null;
    return (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {item ? <ListItem product={item} addToFavorite={addToFavorite} removeFromFavorite={removeFromFavorite}/>: "Loading..."}
  </div>
    )
})

const addToFavorite = id => {
  products.forEach(item => {
    // favoriteProducts.forEach(el => {
    //   if(item.id === id && el.id !== id ) {
    //     setFavoriteProducts(prevState => [...prevState,])
    //   }
    // })
  })
}

const removeFromFavorite = id => {
  setFavoriteProducts(prevState => prevState.filter(item => item.id !== id))
  // setFavoriteProducts(prevState => console.log(prevState))
}
const isItemLoaded = ({ index }) => !!items[index];

const loadMoreItems = (visibleStartIndex, visibleStopIndex) => {
    const key = [visibleStartIndex, visibleStopIndex].join(":"); // 0:10
    if (requestCache[key]) {
      return;
    }
  
    const length = visibleStopIndex - visibleStartIndex;
    const visibleRange = [...Array(length).keys()].map(
      x => x + visibleStartIndex
    );
    const itemsRetrieved = visibleRange.every(index => !!items[index]);
  
    if (itemsRetrieved) {
      requestCache[key] = key;
      return;
    }
  
    // return fetch(
    //   getUrl()
    // )
    //   .then(response => response.json())
    //   .then(data => {
    //     data.records.forEach((city, index) => {
    //       items[index + visibleStartIndex] = city.fields
    //     });
    //   })
    //   .catch(error => console.error("Error:", error));
  };

const loadMoreItemsThrottled = throttle(loadMoreItems, 100);

    return(
    <AutoSizer>
    {({ height, width }) => (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItemsThrottled}
        itemCount={products.length}
      >
        {({ onItemsRendered, ref }) => (
          <List
            className="List"
            height={height}
            itemCount={products.length}
            itemSize={170}
            width={width}
            ref={ref}
            onItemsRendered={onItemsRendered}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>
    )}
  </AutoSizer>
    )
};

  export default Appp;