import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { useAuth } from './Context/AuthContext';

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const postsPerPage = 4; // Posts per page
  const [contentError, setContentError] = useState(''); // Content length error

  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth(); // Get isAdmin status from AuthContext

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };
    fetchPosts();
  }, [location.state?.refresh]);

  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const noticePosts = posts.filter((post) => post.title.startsWith('[공지]'));
  const regularPosts = posts.filter((post) => !post.title.startsWith('[공지]'));

  const handleNextPage = () => {
    if (currentPage < Math.ceil(regularPosts.length / postsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentRegularPosts = regularPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const displayPosts =
    currentPage === 1
      ? [...noticePosts, ...currentRegularPosts]
      : currentRegularPosts;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length > 500) {
      setContentError('내용은 500자를 초과할 수 없습니다.');
      return;
    }

    try {
      await axios.post(`${API_URL}/posts`, {
        title,
        content,
        author,
        password,
      });
      alert('글이 성공적으로 작성되었습니다.');
      setTitle('');
      setContent('');
      setPassword('');
      setAuthor('');
      setIsWriting(false);
      setContentError('');

      const updatedPosts = await axios.get(`${API_URL}/posts`);
      setPosts(updatedPosts.data);
    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('글 작성 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleWriteClick = () => {
    setIsWriting(true);
  };

  const handleCancelClick = () => {
    setIsWriting(false);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    if (post.title.startsWith('[공지]') || isAdmin) {
      navigate(`/post/${post._id}`, { state: { post } });
    } else {
      setShowPasswordModal(true);
      setError('');
      setPasswordInput('');
    }
  };

  const handlePasswordSubmit = async () => {
    if (isAdmin || selectedPost.title.startsWith('[공지]')) return;

    try {
      const response = await axios.post(`${API_URL}/posts/check-password`, {
        postId: selectedPost._id,
        password: passwordInput,
      });

      if (response.data.valid) {
        const postResponse = await axios.get(
          `${API_URL}/posts/${selectedPost._id}`
        );
        navigate(`/post/${selectedPost._id}`, {
          state: { post: postResponse.data },
        });
        setShowPasswordModal(false);
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Error verifying password:', error.message);
      setError('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="main-container board-page">
      <div className="board-container">
        <div className="board-header">
          <h1>게시판</h1>
          {!isWriting && (
            <button className="write-button" onClick={handleWriteClick}>
              글쓰기
            </button>
          )}
        </div>

        {isWriting ? (
          <form onSubmit={handleSubmit} className="board-form">
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            {contentError && <p className="error">{contentError}</p>}
            <input
              type="text"
              placeholder="작성자"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-buttons">
              <button type="submit">작성 완료</button>
              <button type="button" onClick={handleCancelClick}>
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="posts-list">
              {displayPosts.length > 0 ? (
                displayPosts.map((post) => (
                  <div
                    key={post._id}
                    className="post-item"
                    onClick={() => handlePostClick(post)}
                  >
                    <h2>{post.title}</h2>
                    <small>작성자: {post.author}</small>
                  </div>
                ))
              ) : (
                <p>게시물이 없습니다.</p>
              )}
            </div>

            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                이전
              </button>
              <span>페이지 {currentPage}</span>
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(regularPosts.length / postsPerPage)
                }
              >
                다음
              </button>
            </div>
          </>
        )}

        {!isAdmin &&
          showPasswordModal &&
          selectedPost &&
          !selectedPost.title.startsWith('[공지]') && (
            <div className="modal">
              <div className="modal-content centered-modal">
                <h2>{selectedPost.title} 보기</h2>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="비밀번호"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <div className="modal-buttons">
                  <button onClick={handlePasswordSubmit}>확인</button>
                  <button onClick={() => setShowPasswordModal(false)}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Board;
