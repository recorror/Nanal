import { useLocation } from 'react-router-dom';
import Comment from './Comment';

// 댓글 불러오기
function GroupDiaryDetail() {
  const location = useLocation();

  return (
    <div>
      <span>작성자 : {location.state.nickname}</span>
      <div>{location.state.creationDate.slice(0, 10)}</div>
      <div>{location.state.content}</div>
      <div>
        <Comment
          diaryIdx={location.state.diaryIdx}
          groupIdx={location.state.groupIdx}
        />
      </div>
    </div>
  );
}

export default GroupDiaryDetail;
