import { Routes, Route, Navigate } from 'react-router-dom';


import HomePage from "../../pages/HomePage";
import RepoInfo from '../../pages/RepoInfo';
import Appp from '../Appp.js/Appp';
import StickyList from '../StickyList/StickyList';

import s from './App.module.css'


const App = () => {
    return (
            <StickyList />
        // <div className={s.container}>
            
            /* <Routes>
                <Route index element={<HomePage />} />
                <Route path='/:id' element={<RepoInfo />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes> */
        // </div>
    );
};

export default App;