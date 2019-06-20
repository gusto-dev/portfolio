import React, { Component } from 'react';

class LISTS extends Component{
  render(){
    return (
      <section className="lists">
        <p>* 시간이 지남에 따라 제가 작업한 내용에서 변화가 있을 수 있습니다. ( 최대한 제외 하고 있습니다. )</p>
        <div className="table-wrap">
          <div className="group-item tit">
            <span>프로젝트명</span>
            <span>정보</span>
            <span>기여도</span>
            <span>사이트</span>
          </div>
          <div className="group-item">
            <span>뭐</span>
            <span>뭐</span>
            <span>뭐</span>
            <span>뭐</span>
          </div>
        </div>
      </section>
    );
  }
}

export default LISTS;