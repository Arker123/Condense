// SummaryPage.js
import React from 'react';
import styles from './SummaryPage.module.css';

const SummaryPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.video}>
        {/* Embedded YouTube video */}
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/VIDEO_ID" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <div className={styles.summaryContainer}>
        <div className={styles.summary} >
          <h2 className='text-left text-9xl bg-blue-500'>Summary</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nullam interdum, lorem nec facilisis placerat, mi neque 
            bibendum metus, vitae tempor ex tortor sit amet est. 
            Phasellus vehicula volutpat ligula, sed convallis metus 
            vulputate id. Morbi et elit eu leo bibendum fringilla. 
            Fusce sodales ante a justo cursus hendrerit. 
            In hac habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nullam interdum, lorem nec facilisis placerat, mi neque 
            bibendum metus, vitae tempor ex tortor sit amet est. 
            Phasellus vehicula volutpat ligula, sed convallis metus 
            vulputate id. Morbi et elit eu leo bibendum fringilla. 
            Fusce sodales ante a justo cursus hendrerit. 
            In hac habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nullam interdum, lorem nec facilisis placerat, mi neque 
            bibendum metus, vitae tempor ex tortor sit amet est. 
            Phasellus vehicula volutpat ligula, sed convallis metus 
            vulputate id. Morbi et elit eu leo bibendum fringilla. 
            Fusce sodales ante a justo cursus hendrerit. 
            In hac habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nullam interdum, lorem nec facilisis placerat, mi neque 
            bibendum metus, vitae tempor ex tortor sit amet est. 
            Phasellus vehicula volutpat ligula, sed convallis metus 
            vulputate id. Morbi et elit eu leo bibendum fringilla. 
            Fusce sodales ante a justo cursus hendrerit. 
            In hac habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nullam interdum, lorem nec facilisis placerat, mi neque 
            bibendum metus, vitae tempor ex tortor sit amet est. 
            Phasellus vehicula volutpat ligula, sed convallis metus 
            vulputate id. Morbi et elit eu leo bibendum fringilla. 
            Fusce sodales ante a justo cursus hendrerit. 
            In hac habitasse platea dictumst.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
