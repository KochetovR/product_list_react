import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer"
// import {AutoSizer, List} from 'react-virtualized';
import InfiniteLoader from 'react-window-infinite-loader';
import { getRepos } from "../../redux/repos-operations";
import { setCurrentPage } from "../../redux/repos-actions";
import * as reposSelectors from '../../redux/repos-selectors';
import {createPages} from "../../utils/pagesCreator";
import SearchForm from '../../components/SeacrhForm';
import ErrorNotification from '../../components/ErrorNotification';
import ListItem from '../../components/ListItem/ListItem';
import Pagination from "../../components/Pagination";
import PulseLoader from "react-spinners/PulseLoader";
import {CircleArrow as ScrollUpButton} from "react-scroll-up-button";
import Sort from '../../components/Sort';
import { ToastContainer, toast } from 'react-toastify';
import { BsCalendarDateFill, BsCalendarDate, BsSortAlphaDown, BsSortAlphaUpAlt } from 'react-icons/bs';
import { RiStarSFill, RiStarSLine } from 'react-icons/ri';
import 'react-toastify/dist/ReactToastify.css';

import s from './HomePage.module.css';

const override = {
    display: "block",
    width: "200px",
    margin: "0 auto",
    borderColor: "red",
};

const HomePage = () => {
    const [products, setProducts] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchError, setIsFetchError] = useState(false)
    
    
    const [searchValue, setSearchValue] = useState('')
    const [sortByDate, setSortByDate] = useState(null);
    const [sortByStars, setSortByStars] = useState(null);
    const [sortByName, setSortByName] = useState(null);
    const [sortType, setSortType] = useState(null);
    const totalCount = useSelector(reposSelectors.totalCount)
    const perPage = useSelector(reposSelectors.perPage)
    const currentPage = useSelector(reposSelectors.currentPage)
    // const isFetchError = useSelector(reposSelectors.isFetchError)
    const location = useLocation();
    const dispatch = useDispatch()

    const prevSearch = location.state ? location.state.prevSearch : '';
    
    const pagesCount = Math.ceil(totalCount/perPage)
    const pages = []
    createPages(pages, pagesCount, currentPage)

    useEffect(() => {
        if (isFetchError) {
            toast.error('Произошла ошибка запроса. Повторите еще разок', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [isFetchError])

    // useEffect(() => {
    //     if (sortType === 'date') {
    //         setSortRepos(prevRepos => [...prevRepos].sort((a, b) => {
    //             return sortByDate ? (a.created_at.slice(0, 10) > b.created_at.slice(0, 10)) - (a.created_at.slice(0, 10) < b.created_at.slice(0, 10)) : (b.created_at.slice(0, 10) > a.created_at.slice(0, 10)) - (b.created_at.slice(0, 10) < a.created_at.slice(0, 10))
    //         }))
    //         return
    //     }
    //     if (sortType === 'stars') {
    //         setSortRepos(prevRepos => [...prevRepos].sort((a, b) => {
    //             return sortByStars ? a.stargazers_count - b.stargazers_count : b.stargazers_count - a.stargazers_count
    //         }))
    //         return
    //     }
    //     if (sortType === 'name') {
    //         setSortRepos(prevRepos => [...prevRepos].sort((a, b) => {
    //             return sortByName ? (a.name > b.name) - (a.name < b.name) : (b.name > a.name) - (b.name < a.name)
    //         }))
    //         return
    //     }
    // }, [sortByDate, sortType, sortByStars, sortByName])

    const changeCurrentPage = page => {
        dispatch(setCurrentPage(page))
        if (prevSearch.length > 1 && searchValue.trim() === '') {
            setSearchValue(prevSearch)
            return
        }
    }

    const handleClickOnSort = (type, sort) => {
        if (type === 'date') {
            setSortByDate(sort)
            setSortType(type)
            return
        }
        if (type === 'stars') {
            setSortByStars(sort)
            setSortType(type)
            return
        }
        if (type === 'name') {
            setSortByName(sort)
            setSortType(type)
            return
        }
    }

    return (
        <>
            {totalCount > 1 && !isFetchError && <div className={s.sortWrapper}>
                Сортировать по:
                <div className={s.sortIconsWrapper}>
                    <Sort Icon={sortByDate ? BsCalendarDateFill : BsCalendarDate} handleClickOnSort={handleClickOnSort} type={'date'} />
                    <Sort Icon={sortByStars ? RiStarSFill : RiStarSLine} handleClickOnSort={handleClickOnSort} type={'stars'} />
                    <Sort Icon={sortByName ? BsSortAlphaDown : BsSortAlphaUpAlt} handleClickOnSort={handleClickOnSort} type={'name'} />
                </div>
            </div>}
            { isFetchError &&
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            }
            {isFetching
                ?
                <PulseLoader color="blue" margin={10} size={20} cssOverride={override} />
                :
                <ul className={s.reposList}>
                    {products.map(product =>
                    <ListItem product={product} key={product.id}/>)}
                </ul>
                
            }
            {pages.length > 1 && !isFetching && <Pagination pages={pages} currentPage={currentPage} changeCurrentPage={changeCurrentPage} />}
            <ScrollUpButton
                EasingType="linear"
                StopPosition={10}
                ShowAtPosition={50}
                style={{zIndex: 20, border: '3px solid #918252', right: '11px !important', background: 'transparent', fill: 'rgba(219, 175, 61, 0.8) '}}
            />
        </>
    );
};

export default HomePage;