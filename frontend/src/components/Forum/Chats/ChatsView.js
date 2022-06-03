import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./chatsView.css";
import Submenu from "../Submenu";
import ab from "../../../img/a.png"
import hit from "../../../img/hit.png"
import like from "../../../img/like.png"
import imgComment from "../../../img/comment.png"
import FooterGray from "../../Home/FooterGray";

const ChatsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [postData, setPostData] = useState([]);
  const [isLike, setLike] = useState(false);
  const username = localStorage.getItem("username");
  const [comment, setComment] = useState('');
  const onChangeComment = (e) => { setComment(e.target.value) }

  let pathname = location.pathname;
  let [a, b, postId] = pathname.split("/");
  var comment_num;
  // useLocation으로 pathname을 추출한 후, '/'를 기준으로 parameter를 분리함

  useEffect(() => {
    fetchData();
    // console.log(location);
    // console.log(isLike);
  }, [location, isLike]);

  const fetchData = async () => {
    const res = await axios.get(
      process.env.REACT_APP_DB_HOST + `/community/chats/${postId}`
    );
    // console.log(res.data);
    const _postData = {
      id: res.data.id,
      title: res.data.title,
      content: res.data.content,
      hit: res.data.hit,
      like: res.data.like,
      username: res.data.username,
      createAt: res.data.createAt,
      tags: res.data.tags,
      studyStatus: res.data.studyStatus,
      comments: res.data.comments,
    };
    setPostData(_postData);
    comment_num = res.data.comments.length
  };

  const handleLike = async () => {
    const data = {
      username: username,
      postId: postData.id,
    };
    await axios.post(process.env.REACT_APP_DB_HOST + `/api/like`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      console.log("res.data", res.data);
      if (res.data.liked) setLike(true);
      else setLike(false);
    })
      .catch((res) => { console.log(res) });
  };

  const handleDelete = async () => {
    await axios.delete(process.env.REACT_APP_DB_HOST + `/community/study/${postId}`)
      .then(() => {
        console.log("삭제 성공!");
        navigate(-1);
      })
      .catch((res) => console.log(res));
  };

  const handleComment = async () => {
    const data = {
      username: username,
      postID: postId,
      contents: comment,
      // parent: parent,
      // group: group,
    }

    await axios.post(process.env.REACT_APP_DB_HOST + `/api/comments`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      console.log(res);
    }).catch((res) => { console.log(res) });
  }

  return (
    <div>
      <Submenu />
      <div>
        {postData ? (
          <div className="chats-view">
            <div className="chats-contents-all">
              <div className="chats-detail-top">
                <div className="chats-profile">
                  <img className="chats-photo" src={ab} alt="" />
                </div>
                <div className="chats-owner">
                  {postData.username}
                </div>
                <div className="chats-date">{postData.createAt}</div>
              </div>
              <div className="chats-top">
                <div className="chats-title">
                  {postData.title}
                </div>
              </div>
              <div className="chats-content">
                {postData.content}
              </div>
              <div className="chats-options">
                <div className="chats-hit">
                  <img className="img-detail-hit" src={hit} alt="" />
                  {postData.hit}</div>
                <div className="chats-like">
                  <img className="img-detail-like" src={like} alt="" />
                  {postData.like}</div>
                {
                  postData.username === username
                    ?
                    <div className="chats-btns">
                      <button className="btn-modify">수정</button>
                      <button className="btn-delete-post" onClick={() => { handleDelete(); }}>삭제</button>
                    </div>
                    : null
                }
              </div>
            </div>
            <div className="chats-detail-bottom">
              <div className="chats-write-comments">
                <input
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={(e) => onChangeComment(e)}
                  placeholder="댓글을 달아주세요." />
                <button
                  className="btn-comment"
                  onClick={() => { handleComment(); }}
                >댓글달기</button>
              </div>
              {postData.comments ?
                (<div className="chats-comments-all">
                  <div className="number-comments">
                    <h6 className="number-comments-text">개의 답글</h6>
                  </div>
                  <div className="chats-comments">
                    {postData.comments && postData.comments.map(comment => (
                      <div className="container-comments">
                        <div className="comment-detail">
                          <div className="comments-top">
                            <div>
                              <img className="comment-photo" src={ab} alt="" />
                            </div>
                            <div className="comment-owner">학생1</div>
                          </div>
                          <hr className="comment-line" />
                          <div className="comment-content">{comment.contents}</div>
                          <div className="comment-date">5분 전</div>
                          <div className="comments-options">
                            <div className="comment-comment">
                              <img className="img-comment-comment" src={imgComment} alt="" />0
                            </div>
                            <div className="comment-like">
                              <img className="img-comment-like" src={like} alt="" onClick={() => { handleLike(); }} />0
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>) : null}
              <FooterGray />
            </div>
          </div>
        ) : (
          "해당 게시글을 찾을 수 없습니다."
        )
        }
      </div>

    </div >
  );
};

export default ChatsView;
