import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Editor from '../../components/bulletin/Editor';
import RecommendPlace from '../../components/bulletin/RecommendPlace';
import RecommendListItem from '../../components/bulletin/RecommendListItem';
import PlaceHashtag from '../../components/bulletin/PlaceHashtag';

import { useSelector, useDispatch } from 'react-redux';
import { newPost } from '../../slices/bulletin/BulletinSlice';

import breadSample from '../../assets/img/bulletin/bread_sample.jpg';
import { useEffect } from 'react';

const MainForm = styled.form`
    width: 100%;
`;

const TitleArea = styled.div`
    width: 100%;
    margin: auto;
    height: 400px;
    position: relative;
    border-bottom: 1px solid #eee;

    .title-edit-menu {
        display: flex;
        flex-flow: column nowrap;
        position: absolute;
        right: 20%;
        top: 10%;

        label,
        button,
        input {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin: 5px 0;

            border: 1px solid #aaa;
            background-color: white;
            text-align: center;
            line-height: 30px;
            font-size: 15px;
            font-weight: 600;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .title-input {
        width: 500px;
        height: 150px;
        background-color: #00000022;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        box-sizing: border-box;
        padding: 10px;

        input {
            background: none;
            border: none;
            color: white;

            &::placeholder {
                color: white;
            }
        }

        .title-input__main-title {
            width: 480px;
            height: 70px;
            font-size: 40px;
            margin-bottom: 20px;
        }

        .title-input__desc {
            width: 100%;
            height: 40px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;

            input {
                font-size: 20px;
                display: inline-block;
                width: 200px;

                &:last-child {
                    text-align: right;
                }
            }
        }
    }
`;

const PostingArea = styled.section`
    width: 100%;
    padding: 20px;
    margin: auto;
    box-sizing: border-box;

    .send-post {
        width: 800px;
        margin: auto;
        text-align: right;

        .send-post__button {
            border: none;
            padding: 10px 15px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;

            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }
        }
    }
`;

const RecommendPlaceArea = styled.div`
    width: 800px;
    margin: auto;
    margin-bottom: 40px;

    .recommend-place-top {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 20px;
        padding: 0 10px;

        h3 {
            font-size: 20px;
            font-weight: 600;
        }

        button {
            background-color: tomato;
            border: 1px solid tomato;
            color: white;
            border-radius: 10px;
            padding: 5px;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .recommend-place-body {
        width: 100%;
        box-sizing: border-box;
    }
`;

const CategoryArea = styled.div`
    width: 800px;
    margin: auto;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 20px;
    margin-bottom: 40px;

    .category-tags {
        flex: 2 1 auto;

        span {
            display: inline-block;
            font-size: 12px;
            padding: 5px;
            border-radius: 5px;
            background-color: #eee;
            margin-right: 15px;
            margin-bottom: 10px;

            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }
        }
    }

    .category-addButton {
        flex: 0 0 auto;
        border: none;
        border-radius: 10px;
        width: 65px;
        height: 30px;
        font-size: 12px;
        background-color: #ccc;

        &:hover {
            cursor: pointer;
        }
    }
`;

const NewPost = memo(() => {
    /** 슬라이스 */
    const { data, loading, error } = useSelector(state => state.BulletinSlice);
    const dispatch = useDispatch();

    /** 상단 제목란 배경색 변경 */
    // 배경색 저장할 state
    const [backgroundColor, setBackgroundColor] = useState('#fff');
    // 사용자 컬러 인풋 바뀌면 state 변경
    const onBackgroundColorInputChange = useCallback(e => {
        setBackgroundColor(e.currentTarget.value);
    }, []);

    /** 게시글 본문 내용 */
    // 내용 저장용 state
    const [content, setContent] = useState('');
    // 본문 내용 state에 set
    const setContentFunc = useCallback(v => {
        setContent(v);
    }, []);

    /** 모달창 */
    // 모달 오픈여부
    const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
    const [isHashtagModalOpen, setIsHasgtagModalOpen] = useState(false);
    // 모달창 열기 함수
    const openPlaceModal = useCallback(e => {
        e.preventDefault();
        setIsPlaceModalOpen(state => true);
    }, []);
    const openHashtagModal = useCallback(e => {
        e.preventDefault();
        setIsHasgtagModalOpen(state => true);
    }, []);
    // 모달창 닫기 함수
    const closePlaceModal = useCallback(e => {
        setIsPlaceModalOpen(state => false);
    }, []);
    const closeHashtagModal = useCallback(e => {
        setIsHasgtagModalOpen(state => false);
    }, []);
    // 모달 오픈시 스크롤 방지
    useEffect(() => {
        if (isPlaceModalOpen || isHashtagModalOpen) {
            document.body.style.cssText = `
                position: fixed; 
                top: -${window.scrollY}px;
                overflow-y: scroll;
                width: 100%;
            `;
        } else {
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
    }, [isPlaceModalOpen, isHashtagModalOpen]);

    /** 추천 장소 선택하기 */
    // 선택한 장소 목록
    const [selectedPlaces, setSelectedPlaces] = useState([]);

    /** 관련 태그 설정하기 */
    const [selectedTags, setSelectedTags] = useState([]);
    
    /** 게시물 게시하기 */
    const onPosting = useCallback(e => {
        e.preventDefault();

        const postTitle = e.currentTarget.postTitle.value;
        if (postTitle === '') {
            alert('제목을 입력하세요.');
            e.currentTarget.postTitle.focus();
            return;
        }
        
        if (content === '') {
            alert('내용을 입력하세요.');
            return;
        }

        const backgroundImage = e.currentTarget.backgroundImageInput.value;
        const postUser = 1; // <TO DO> 로그인 정보 불러오기

        const selectedPlace_light = [];
        for (const k of selectedPlaces) {
            const temp = {};
            temp.id = k.id;
            temp.place_name = k.place_name;
            temp.address_name = k.address_name;
            temp.place_img = k.place_img;
            temp.like = k.like;
            temp.rating = k.rating;

            selectedPlace_light.push(temp);
        }

        const data = {
            title: postTitle,
            postdate: dayjs().format('YYYY-MM-DD'),
            user_id: postUser,
            bgcolor: backgroundColor,
            bgimage: backgroundImage,
            content: content,
            selectedPlaces: selectedPlace_light,
            selectedTags: selectedTags,
            like: 0,
        }

        dispatch(newPost(data));
    }, [backgroundColor, content, selectedPlaces, selectedTags]);

    return (
        <MainForm onSubmit={onPosting}>
            <TitleArea style={{ backgroundColor: backgroundColor }}>
                <div className="title-edit-menu">
                    <label htmlFor="backgroundImageInput">B</label>
                    <input type="file"
                        accept='.jpg,.PNG'
                        name='backgroundImageInput'
                        id='backgroundImageInput'
                        style={{display: 'none'}}
                    />
                    <input type="color" name="backgroundColorInput" id="backgroundColorInput" onChange={onBackgroundColorInputChange}/>
                    {/* <button>A</button> */}
                </div>
                <div className='title-input'>
                    <input type="text" name='postTitle' className='title-input__main-title' placeholder='제목을 입력하세요' />
                    <div className='title-input__desc'>
                        <input type="text" name='postDate' placeholder='게시일' disabled />
                        <input type="text" name='postUser' placeholder='게시자' disabled />
                    </div>
                </div>
            </TitleArea>

            <PostingArea>
                <Editor id='editor' setContent={setContentFunc} />
                <RecommendPlaceArea>
                    <RecommendPlace
                        isOpen={isPlaceModalOpen}
                        closeModal={closePlaceModal}
                        setSelectedPlaces={setSelectedPlaces}
                    />
                    <div className='recommend-place-top'>
                        <h3>이 글에서 추천한 장소들</h3>
                        <button onClick={openPlaceModal}>장소 추가하기</button>
                    </div>
                    <div className='recommend-place-body'>
                        <ul>
                            {
                                selectedPlaces.map((v, i) => {
                                    return (
                                        <RecommendListItem
                                            key={i}
                                            img={v?.place_img[0] ? v.place_img[0] : breadSample}
                                            alt='플레이스 이미지'
                                            title={v.place_name}
                                            address={v.address_name}
                                            commend={v.like}
                                            reaction={v.rating}
                                        />
                                    );
                                })
                            }
                        </ul>
                    </div>
                </RecommendPlaceArea>

                <CategoryArea>
                    <PlaceHashtag
                        isOpen={isHashtagModalOpen}
                        closeModal={closeHashtagModal}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                    />
                    <div className='category-tags'>
                        {
                            selectedTags.map((v, i) => {
                                return <span key={i}>{v}</span>
                            })
                        }
                    </div>
                    <button type='button' className='category-addButton' onClick={openHashtagModal}>
                        + 더 보기
                    </button>
                </CategoryArea>

                <div className='send-post'>
                    <button type='submit' className='send-post__button'>저장하기</button>
                </div>
            </PostingArea>
        </MainForm>
    );
});

export default NewPost;