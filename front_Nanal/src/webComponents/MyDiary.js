import nmr from '../src_assets/img/bookmark-name/name-mark-red.svg';
import diaryImgRed from '../src_assets/img/diary-img-red.svg';
import Calendar from 'react-calendar';
import React, { useState } from 'react';
import DiaryCreate from '../webComponents/diary/DiaryCreate';
import DiaryList from '../webComponents/diary/DiaryList';
import '../src_assets/css/Calendar.css';

const leftPad = (value) => {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
};

const toStringByFormatting = (value, delimeter = '-') => {
  const year = value.getFullYear();
  const month = leftPad(value.getMonth() + 1);
  const date = leftPad(value.getDate());

  return [year, month, date].join(delimeter);
};
const curDate = toStringByFormatting(new Date());

const MyDiary = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className='relative w-[1440px] mx-auto'>
      <div className='absolute z-20 border-none inset-y-52 left-60'>
        <Calendar
          onChange={onChange}
          value={value}
          calendarType='ISO 8601'
          formatDay={(locale, date) =>
            date.toLocaleString('en', { day: 'numeric' })
          }
        />
      </div>
      <p className='absolute z-30 left-[330px] inset-y-28'>내 일기</p>
      <img src={nmr} className='absolute z-20 left-60 inset-y-20' />
      <img src={diaryImgRed} className='absolute w-[1440px] z-10' />
      <div className='absolute z-20 w-1/3 inset-y-16 right-48'>
        {/* <DiaryCreate curDate={curDate} /> */}
      </div>
      <div className='absolute z-20 w-1/3 inset-y-16 right-48'>
        <DiaryList isToggle={0} curDate={curDate} />
      </div>
    </div>
  );
};

export default MyDiary;