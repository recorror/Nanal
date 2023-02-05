import { useState } from "react";

function DiaryGroup({ item }) {
  // 체크된 그룹을 넣어줄 배열
  const [checkedList, setCheckedList] = useState([]);
  // input 태그가 체크된 경우 실행되는 함수
  const onChecked = (checked, id) => {
    if (checked) {
      setCheckedList([...checkedList, id]);
    } else if (!checked && checkedList.find((el) => el === id)) {
      setCheckedList(checkedList.filter((el) => el !== id));
    }
  };
  console.log(checkedList);

  return (
    <div>
      <div className="bg-[#F7F7F7] border-2 border-solid border-slate-400 rounded-lg m-1 mb-3 p-2">
        <input
          type="checkbox"
          id={item.groupDetail.groupIdx}
          checked={
            checkedList.includes(item.groupDetail.groupIdx) ? true : false
          }
          onChange={(e) => onChecked(e.target.value, item.groupDetail.groupIdx)}
        />
        <label htmlFor={item.groupDetail.groupIdx}>
          {item.groupDetail.groupName}
        </label>
        <br />
        {item.tags.map((tagging, idx) => {
          if (tagging.tag) return <span key={idx}>#{tagging.tag}&nbsp;</span>;
          // return tagging.tag ? <span key={idx}>#{tagging.tag}</span> : <></>;
        })}
      </div>
    </div>
  );
}

export default DiaryGroup;