import React, { useEffect, useState } from 'react';
import styles from '../../styles/WordCloud.module.scss';
import Words from './Words';
import { useNavigate } from 'react-router-dom';
import { DotLoader } from 'react-spinners';

const WordCloud = () => {
  const redirection = useNavigate();
  const {
    wordCloudContainer,
    titleContainer,
    mainTitle,
    subheading,
    cloudContainer,
    time,
    boxContainer,
    loadContainer,
    loadContent,
  } = styles;

  const API_BASE_URL =
    'http://localhost:8181/issue-trend/todayKeywordsFrequency';

  const [words, setWords] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setTimeout(async () => {
          const response = await fetch(API_BASE_URL);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const selectWordData = data.slice(0, 120);
          setLoading(false);
          const transformedData = selectWordData.map((element) => [
            element.keyword,
            element.frequency * 2,
          ]);
          setWords(transformedData);
        }, 2000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  // 현재 시간
  const today = new Date();

  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    <>
      <div className={wordCloudContainer}>
        <div className={titleContainer}>
          <div className={mainTitle}>TODAY</div>
          <div className={subheading}>오늘의 사회뉴스 키워드</div>
        </div>
        <div className={boxContainer}>
          <div className={time}>{dateString} 기준</div>
          {loading ? (
            <div className={loadContainer}>
              <DotLoader color='#413F42' size={70} speedMultiplier={1.5} />
              <div className={loadContent}>키워드 불러오는중 ..</div>
            </div>
          ) : (
            <div className={cloudContainer}>
              <Words words={words} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WordCloud;
