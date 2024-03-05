// SummaryPage.js
import React, { useEffect, useState } from "react";
import styles from "./SummaryPage.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";

const SummaryPage = () => {
  const [url, setUrl] = useState("");

  const [summaryText, setSummaryText] = useState("");

  const fetchSummary = async () => {
    const res = await axios.post("http://localhost:5000/summary/generate", {
      url,
    });
    setSummaryText(res.data);
  };

  useEffect(() => {}, [url]);

  return (
    <div className={styles.summarybackground}>
      <input
        type="text"
        placeholder="Enter URL"
        className="p-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="bg-red-500 p-2 " onClick={() => fetchSummary()}>
        Summarize
      </button>
      <div className={styles.container}>
        <div className={`${styles.topRow}`}>
          <div className={`${styles.video}`}>
            {/* Embedded YouTube video */}
            <iframe
              width="560"
              height="315"
              src={url}
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
            <div className={styles.summaryTextContainer}>{summaryText}</div>
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
