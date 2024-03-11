// SummaryPage.js
import React from "react";
import styles from "./SummaryPage.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const SummaryPage = () => {
  return (
    <div className={styles.summarybackground}>
      <div className={styles.container}>
        <div className={`${styles.topRow}`}>
          <div className={`${styles.video}`}>
            {/* Embedded YouTube video */}
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className={`${styles.summary} ${styles.scrollable}`}>
            <div className={styles.summaryContent}>
              <h2 className={styles.summaryHeader}>SUMMARY</h2>
              <span
                className={`headerIcon ${styles.headerIcon}`}
                onClick={() => void 0}
              >
                <ContentCopyIcon />
              </span>
            </div>
            <hr className={styles.line} />
            <div className={styles.summaryTextContainer}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              interdum, lorem nec facilisis placerat, mi neque bibendum metus,
              vitae tempor ex tortor sit amet est. Phasellus vehicula volutpat
              ligula, sed convallis metus vulputate id. Morbi et elit eu leo
              bibendum fringilla. Fusce sodales ante a justo cursus hendrerit.
              In hac habitasse platea dictumst.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Nullam interdum, lorem nec facilisis
              placerat, mi neque bibendum metus, vitae tempor ex tortor sit amet
              est. Phasellus vehicula volutpat ligula, sed convallis metus
              vulputate id. Morbi et elit eu leo bibendum fringilla. Fusce
              sodales ante a justo cursus hendrerit. In hac habitasse platea
              dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam interdum, lorem nec facilisis placerat, mi neque bibendum
              metus, vitae tempor ex tortor sit amet est. Phasellus vehicula
              volutpat ligula, sed convallis metus vulputate id. Morbi et elit
              eu leo bibendum fringilla. Fusce sodales ante a justo cursus
              hendrerit. In hac habitasse platea dictumst.Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Nullam interdum, lorem nec
              facilisis placerat, mi neque bibendum metus, vitae tempor ex
              tortor sit amet est. Phasellus vehicula volutpat ligula, sed
              convallis metus vulputate id. Morbi et elit eu leo bibendum
              fringilla. Fusce sodales ante a justo cursus hendrerit. In hac
              habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nullam interdum, lorem nec facilisis placerat, mi
              neque bibendum metus, vitae tempor ex tortor sit amet est.
              Phasellus vehicula volutpat ligula, sed convallis metus vulputate
              id. Morbi et elit eu leo bibendum fringilla. Fusce sodales ante a
              justo cursus hendrerit. In hac habitasse platea dictumst. Nullam
              interdum, lorem nec facilisis placerat, mi neque bibendum metus,
              vitae tempor ex tortor sit amet est. Phasellus vehicula volutpat
              ligula, sed convallis metus vulputate id. Morbi et elit eu leo
              bibendum fringilla. Fusce sodales ante a justo cursus hendrerit.
              In hac habitasse platea dictumst. Nullam interdum, lorem nec
              facilisis placerat, mi neque bibendum metus, vitae tempor ex
              tortor sit amet est. Phasellus vehicula volutpat ligula, sed
              convallis metus vulputate id. Morbi et elit eu leo bibendum
              fringilla. Fusce sodales ante a justo cursus hendrerit. In hac
              habitasse platea dictumst.
            </div>
          </div>
        </div>
        <div className={styles.bottomRow}>
          <div className={`${styles.transcript} ${styles.scrollable}`}>
            <div className={styles.transcriptContent}>
              <h2 className={styles.transcriptHeader}>TRANSCRIPT</h2>
              <span
                className={`headerIcon ${styles.headerIcon}`}
                onClick={() => void 0}
              >
                <ContentCopyIcon />
              </span>
            </div>
            <hr className={styles.line} />
            <div className={styles.summaryTextContainer}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              interdum, lorem nec facilisis placerat, mi neque bibendum metus,
              vitae tempor ex tortor sit amet est. Phasellus vehicula volutpat
              ligula, sed convallis metus vulputate id. Morbi et elit eu leo
              bibendum fringilla. Fusce sodales ante a justo cursus hendrerit.
              In hac habitasse platea dictumst.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Nullam interdum, lorem nec facilisis
              placerat, mi neque bibendum metus, vitae tempor ex tortor sit amet
              est. Phasellus vehicula volutpat ligula, sed convallis metus
              vulputate id. Morbi et elit eu leo bibendum fringilla. Fusce
              sodales ante a justo cursus hendrerit. In hac habitasse platea
              dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam interdum, lorem nec facilisis placerat, mi neque bibendum
              metus, vitae tempor ex tortor sit amet est. Phasellus vehicula
              volutpat ligula, sed convallis metus vulputate id. Morbi et elit
              eu leo bibendum fringilla. Fusce sodales ante a justo cursus
              hendrerit. In hac habitasse platea dictumst.Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Nullam interdum, lorem nec
              facilisis placerat, mi neque bibendum metus, vitae tempor ex
              tortor sit amet est. Phasellus vehicula volutpat ligula, sed
              convallis metus vulputate id. Morbi et elit eu leo bibendum
              fringilla. Fusce sodales ante a justo cursus hendrerit. In hac
              habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nullam interdum, lorem nec facilisis placerat, mi
              neque bibendum metus, vitae tempor ex tortor sit amet est.
              Phasellus vehicula volutpat ligula, sed convallis metus vulputate
              id. Morbi et elit eu leo bibendum fringilla. Fusce sodales ante a
              justo cursus hendrerit. In hac habitasse platea dictumst. Nullam
              interdum, lorem nec facilisis placerat, mi neque bibendum metus,
              vitae tempor ex tortor sit amet est. Phasellus vehicula volutpat
              ligula, sed convallis metus vulputate id. Morbi et elit eu leo
              bibendum fringilla. Fusce sodales ante a justo cursus hendrerit.
              In hac habitasse platea dictumst. Nullam interdum, lorem nec
              facilisis placerat, mi neque bibendum metus, vitae tempor ex
              tortor sit amet est. Phasellus vehicula volutpat ligula, sed
              convallis metus vulputate id. Morbi et elit eu leo bibendum
              fringilla. Fusce sodales ante a justo cursus hendrerit. In hac
              habitasse platea dictumst.
            </div>
          </div>
          <div className={`${styles.notes} ${styles.scrollable}`}>
            <div className={styles.notesContent}>
              <h2 className={styles.notesHeader}>NOTES</h2>
              <span
                className={`headerIcon ${styles.headerIcon}`}
                onClick={() => void 0}
              >
                <ContentCopyIcon />
              </span>
            </div>
            <hr className={styles.line} />
            <div className={styles.summaryTextContainer}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              interdum, lorem nec facilisis placerat, mi neque bibendum metus,
              vitae tempor ex tortor sit amet est. Phasellus vehicula volutpat
              ligula, sed convallis metus vulputate id. Morbi et elit eu leo
              bibendum fringilla. Fusce sodales ante a justo cursus hendrerit.
              In hac habitasse platea dictumst.Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Nullam interdum, lorem nec facilisis
              placerat, mi neque bibendum metus, vitae tempor ex tortor sit amet
              est. Phasellus vehicula volutpat ligula, sed convallis metus
              vulputate id. Morbi et elit eu leo bibendum fringilla. Fusce
              sodales ante a justo cursus hendrerit. In hac habitasse platea
              dictumst.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam interdum, lorem nec facilisis placerat, mi neque bibendum
              metus, vitae tempor ex tortor sit amet est. Phasellus vehicula
              volutpat ligula, sed convallis metus vulputate id. Morbi et elit
              eu leo bibendum fringilla. Fusce sodales ante a justo cursus
              hendrerit. In hac habitasse platea dictumst.Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Nullam interdum, lorem nec
              facilisis placerat, mi neque bibendum metus, vitae tempor ex
              tortor sit amet est. Phasellus vehicula volutpat ligula, sed
              convallis metus vulputate id. Morbi et elit eu leo bibendum
              fringilla. Fusce sodales ante a justo cursus hendrerit. In hac
              habitasse platea dictumst.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Nullam interdum, lorem nec facilisis placerat, mi
              neque bibendum metus, vitae tempor ex tortor sit amet est.
              Phasellus vehicula volutpat ligula, sed convallis metus vulputate
              id. Morbi et elit eu leo bibendum fringilla. Fusce sodales ante a
              justo cursus hendrerit. In hac habitasse platea dictumst. Nullam
              interdum, lorem nec facilisis placerat, mi neque bibendum metus,
              vitae tempor ex tortor sit amet est. Phasellus vehicula volutpat
              ligula, sed convallis metus vulputate id. Morbi et elit eu leo
              bibendum fringilla. Fusce sodales ante a justo cursus hendrerit.
              In hac habitasse platea dictumst. Nullam interdum, lorem nec
              facilisis placerat, mi neque bibendum metus, vitae tempor ex
              tortor sit amet est. Phasellus vehicula volutpat ligula, sed
              convallis metus vulputate id. Morbi et elit eu leo bibendum
              fringilla. Fusce sodales ante a justo cursus hendrerit. In hac
              habitasse platea dictumst.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;