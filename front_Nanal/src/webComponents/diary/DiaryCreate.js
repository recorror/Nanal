import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios_api from '../../config/Axios';
import { onLogin } from '../../config/Login';
import Swal from 'sweetalert2';
import diaryImgRed from '../../src_assets/img/diary-img/diary-img-red.svg';

function DiaryCreate({}) {
  const location = useLocation();
  // 날짜, 일기, 그룹여부 데이터 받기
  const [date, setDate] = useState(location.state.today);
  const [content, setContent] = useState('');
  const [group, setGroup] = useState('개인');

  // 포커싱 기능
  const contentRef = useRef();
  // 리셋 함수
  const resetData = () => {
    setDate(location.state.today);
    setContent('');
    setGroup('개인');
  };

  // 작성완료 버튼 누르면 실행되는 함수 - axios 사용해서 백s엔드와 통신
  const handleSubmit = (e) => {
    e.preventDefault();
    // 유효성 검사 후 포커싱
    if (content.length < 2) {
      contentRef.current.focus();
      return;
    } else if (content.length > 300) {
      Swal.fire({
        icon: 'error', // Alert 타입
        title: '일기 저장 실패', // Alert 제목
        text: '일기는 300자 이하로 작성해주세요.', // Alert 내용
      });
    }
    onLogin();
    axios_api
      .post('diary', {
        // 날짜 데이터도 전달하기
        diaryDate: date,
        // 선택한 그룹은 배열 형태로 전달해야 함
        groupIdxList: checkedList,
        content: content,
      })
      .then(({ data }) => {
        if (data.statusCode === 200) {
          if (data.data.responseMessage === '일기 생성 성공') {
            Swal.fire({
              icon: 'success', // Alert 타입
              title: '일기 저장 완료', // Alert 제목
              text: '작성하신 일기가 작성 완료됐습니다.', // Alert 내용
            });
            // alert('저장 성공');
            // 일기 생성 후 홈으로 보내기
            navigate('/', { replace: true });
          }
        } else {
          console.log('일기 생성 오류: ');
          console.log(data.statusCode);
          console.log(data.data.responseMessage);
        }
      })
      .catch(({ error }) => {
        console.log('일기 생성 오류: ', error);
      });

    // 저장 후 일기 데이터 초기화
    setContent('');
    setGroup('private');
  };

  // 체크된 그룹을 넣어줄 배열
  const [checkedList, setCheckedList] = useState([]);
  // input 태그가 체크된 경우 실행되는 함수
  const onChecked = (checked, id) => {
    if (checked) {
      setCheckedList([...checkedList, id]);
    } else {
      setCheckedList(checkedList.filter((el) => el !== id));
    }
  };

  // 뒤로가기 기능
  const navigate = useNavigate();
  // 그룹 리스트 데이터 가져오기
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    onLogin();
    axios_api
      .get('group/list/0')
      .then(({ data }) => {
        if (data.statusCode === 200) {
          setGroupList(null);
          if (data.data.responseMessage === '그룹 리스트 조회 성공') {
            setGroupList(data.data.groupList);
          }
        } else {
          console.log('그룹 리스트 불러오기 오류: ');
          console.log(data.statusCode);
          console.log(data.data.responseMessage);
        }
      })
      .catch(({ error }) => {
        console.log('그룹 리스트 불러오기 오류: ' + error);
      });
  }, []);

  // 그룹 리스트 보여줄지 말지
  const [isShow, setShow] = useState(false);

  return (
    <div className='relative w-[1440px] mx-auto'>
      <img src={diaryImgRed} className='absolute w-[1280px] z-10 left-12' />
      <div className='grid justify-items-center'>
        <form className='min-h-full mt-10 w-[720px]'>
          <p className='text-3xl font-bold text-center'>일기 작성</p>
          {/* 날짜 선택란 */}
          <div className='mt-5 text-2xl'>
            <input
              className='p-2 my-2 text-2xl rounded-lg cursor-pointer bg-slate-300/50'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type='date'
            />
            {/* 일기 내용 작성란 */}
            <div>
              <textarea
                className='w-full h-64 px-2 py-2 my-2 rounded-lg bg-slate-300/50'
                placeholder='오늘의 하루는 어땠나요?'
                name='content'
                ref={contentRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </div>
          </div>
          {/* 그룹 여부 선택란 */}
          <div className='mt-2'>
            <p className='my-2 text-2xl font-bold'>공개 범위 설정</p>
            <input
              className='cursor-pointer'
              id='private'
              type='radio'
              value='개인'
              checked={group === '개인'}
              onChange={(e) => setGroup(e.target.value)}
              onClick={() => setShow(false)}
            />
            <label
              className='ml-2 mr-4 text-2xl cursor-pointer'
              htmlFor='private'
            >
              개인
            </label>
            <input
              className='cursor-pointer'
              id='group'
              type='radio'
              value='그룹'
              checked={group === '그룹'}
              onChange={(e) => setGroup(e.target.value)}
              onClick={() => setShow(true)}
            />
            <label className='ml-2 text-2xl cursor-pointer' htmlFor='group'>
              그룹
            </label>
            {isShow ? (
              <>
                {groupList.map((groupItem, idx) => {
                  return (
                    <div
                      key={idx}
                      className='bg-[#F7F7F7] border-2 border-solid border-slate-400 rounded-lg m-1 mb-3 p-2'
                    >
                      <label
                        htmlFor={groupItem.groupDetail.groupIdx}
                        className='cursor-pointer'
                      >
                        {groupItem.groupDetail.groupName}
                      </label>
                      <input
                        className='cursor-pointer'
                        type='checkbox'
                        id={groupItem.groupDetail.groupIdx}
                        checked={
                          checkedList.includes(groupItem.groupDetail.groupIdx)
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          onChecked(
                            e.target.checked,
                            groupItem.groupDetail.groupIdx
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
          {/* 작성 취소 및 완료 버튼 */}
          <footer className='relative flex justify-between px-1 pb-5 translate-y-full'>
            <input
              className='hover:bg-slate-300 bg-slate-300/50 rounded-xl px-2.5 py-1 block font-bold cursor-pointer text-2xl'
              type='reset'
              onClick={resetData}
              value='초기화'
            />
            <button
              className='hover:bg-sky-700 bg-cyan-600 text-white px-2.5 py-1 rounded-xl block font-bold text-2xl'
              onClick={handleSubmit}
            >
              작성 완료
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default DiaryCreate;
