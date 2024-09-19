import React from 'react';
import { useAuth } from './Context/AuthContext'; // AuthContext에서 로그인 상태 가져오기
import './App.css';

function Guide() {
  const { isAuthenticated } = useAuth(); // 로그인 상태 가져오기

  return (
    <div className="main-container">
      <div className="guide-header">
        <h1>환영합니다~!</h1>
      </div>
      <div className="guide-content">
        <p>
          저희 프로그램은 주통스크립트로 돌아가며, 다음과 같은 기능을
          제공합니다:
        </p>
        <ul>
          <li>
            <strong>프로그램</strong>: 프로그램 페이지에서 아이디를 입력하고
            버튼을 클릭해야만 게시판 및 CPU 메모리등 진단 결과를 확인할 수
            있습니다.
          </li>
          <li>
            <strong>팀원 소개</strong>: 프로젝트에 참여한 팀원들을 소개합니다.
          </li>
          <li>
            <strong>회원 관리</strong>: 로그인한 사용자가 관리자 ID, 비밀번호,
            서버 IP 등을 입력하여 실시간으로 회사의 서버를 진단할 수 있습니다.
          </li>
          <li>
            <strong>로그인 & 회원가입</strong>: 사용자 인증을 위한 페이지입니다.
            처음 오신 분은 가입 또는 로그인 후 이용하실 수 있습니다.
          </li>
          <li>
            <strong>CPU & Memory Reports</strong>: 서버의 모니터링 결과를
            그래프로 보여줍니다.
          </li>
          <li>
            <strong>게시판</strong>: 서버 진단을 요청할 수 있습니다. 글을
            작성할때 작성자 이름은 가입한 ID로 입력하지 말아주세요. 그리고
            입력한 비밀번호는 꼭 기억해주세요. 게시물 수정, 삭제, 진단 결과
            확인할때 사용됩니다.
          </li>
          <li>
            <strong>로그아웃 및 새로고침</strong>: 이 사이트는 로그아웃 버튼을
            누르거나 새로고침을 하면 자동으로 로그아웃 됩니다. 설정해놓은 데이터
            베이스가 초기화 되니 프로그램 페이지에 가서 다시 아이디를 입력하고
            버튼을 눌러주세요.{' '}
          </li>
        </ul>
        {!isAuthenticated && (
          <p>
            시작하기 전에, 먼저 <a href="/register">회원가입</a> 또는{' '}
            <a href="/login">로그인</a>을 해주세요. 이후 원하시는 서비스를
            자유롭게 이용하실 수 있습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default Guide;
