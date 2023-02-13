import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getCookie } from '../config/Cookie';
import LogoHome from '../webComponents/LogoHome';
import MyDiary from '../webComponents/MyDiary';
import GroupDiary from '../webComponents/GroupDiary';
import FriendList from '../webComponents/FriendList';
import RecycleBin from '../webComponents/RecycleBin';
import DiaryNew from '../webComponents/DiaryNew';
import SignUp from '../webComponents/account/SignUp';
import SignIn from '../webComponents/account/SignIn';
import DiaryDetail from '../webComponents/diary/DiaryDetail';
import DiaryUpdate from '../webComponents/diary/DiaryUpdate';
import NotFound from '../webComponents/another/NotFound';
import bmkRR from '../src_assets/img/bookmark/bookmark-red-red.svg';
import bmkRW from '../src_assets/img/bookmark/bookmark-red-white.svg';
import bmkOO from '../src_assets/img/bookmark/bookmark-orange-orange.svg';
import bmkOW from '../src_assets/img/bookmark/bookmark-orange-white.svg';
import bmkYY from '../src_assets/img/bookmark/bookmark-yellow-yellow.svg';
import bmkYW from '../src_assets/img/bookmark/bookmark-yellow-white.svg';
import bmkGG from '../src_assets/img/bookmark/bookmark-green-green.svg';
import bmkGW from '../src_assets/img/bookmark/bookmark-green-white.svg';
import bmkBB from '../src_assets/img/bookmark/bookmark-blue-blue.svg';
import bmkBW from '../src_assets/img/bookmark/bookmark-blue-white.svg';

const getStringDate = (date) => {
  // 대한민국의 offset을 수동으로 추가한 뒤 날짜 전달
  const offset = date.getTimezoneOffset() * 60000;
  const dateOffset = new Date(date.getTime() - offset);
  return dateOffset.toISOString().slice(0, 10);
};

const AppMain = () => {
  const [today, setToday] = useState(getStringDate(new Date()));
  const accessToken = getCookie('accessToken');
  const [homeState, setHomeState] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const changeHomeStateZero = () => {
    setHomeState([true, false, false, false, false]);
  };
  const changeHomeStateOne = () => {
    setHomeState([false, true, false, false, false]);
  };
  const changeHomeStateTwo = () => {
    setHomeState([false, false, true, false, false]);
  };
  const changeHomeStateThree = () => {
    setHomeState([false, false, false, true, false]);
  };
  const changeHomeStateFour = () => {
    setHomeState([false, false, false, false, true]);
  };

  return (
    <div>
      <Routes>
        <Route path='/' element={<LogoHome />}></Route>
        {homeState[0] === true ? (
          <Route
            path='/home'
            element={
              <MyDiary
                changeHomeStateThree={changeHomeStateThree}
                setToday={setToday}
              />
            }
          ></Route>
        ) : homeState[1] === true ? (
          <Route path='/home' element={<GroupDiary />}></Route>
        ) : homeState[2] === true ? (
          <Route path='/home' element={<FriendList />}></Route>
        ) : homeState[3] === true ? (
          <Route path='/home' element={<DiaryNew today={today} />}></Route>
        ) : homeState[4] === true ? (
          <Route path='/home' element={<RecycleBin />}></Route>
        ) : null}
        <Route path='/SignIn' element={<SignIn />}></Route>
        <Route path='/SignUp' element={<SignUp />}></Route>
        <Route path='/Diary/Detail' element={<DiaryDetail />}></Route>
        <Route path='/Diary/Edit' element={<DiaryUpdate />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
      {accessToken !== undefined ? (
        <div className='w-[1440px]'>
          {homeState[0] === true ? (
            <img src={bmkRR} className='absolute z-0 right-[270px] top-20' />
          ) : (
            <Link to='/home' onClick={changeHomeStateZero}>
              <img src={bmkRW} className='absolute z-0 right-[270px] top-20' />
            </Link>
          )}
          {homeState[1] === true ? (
            <img src={bmkOO} className='absolute z-0 right-[270px] top-40' />
          ) : (
            <Link to='/home' onClick={changeHomeStateOne}>
              <img src={bmkOW} className='absolute z-0 right-[270px] top-40' />
            </Link>
          )}
          {homeState[2] === true ? (
            <img src={bmkYY} className='absolute z-0 right-[270px] top-60' />
          ) : (
            <Link to='/home' onClick={changeHomeStateTwo}>
              <img src={bmkYW} className='absolute z-0 right-[270px] top-60' />
            </Link>
          )}
          {homeState[3] === true ? (
            <img src={bmkGG} className='absolute z-0 right-[270px] top-80' />
          ) : (
            <Link to='/home' onClick={changeHomeStateThree}>
              <img src={bmkGW} className='absolute z-0 right-[270px] top-80' />
            </Link>
          )}
          {homeState[4] === true ? (
            <img
              src={bmkBB}
              className='absolute z-0 right-[270px] top-[400px]'
            />
          ) : (
            <Link to='/home' onClick={changeHomeStateFour}>
              <img
                src={bmkBW}
                className='absolute z-0 right-[270px] top-[400px]'
              />
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AppMain;