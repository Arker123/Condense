import React from 'react';
import styles from './a.module.css';

function Aa() {
  return (
    <div className={styles.App}>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

function Header() {
  // Your header content goes here
  return <header>
      <img src="/images/logo_condense.jpg" alt={styles.Logo} className={styles["header-logo"]} /> 
  Condense
    </header>;
}

function MainContent() {
  return (
    <main>
      <HeroSection />
      <ExploreByCategory />
    </main>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <h1>YouTube Summaries</h1>
      <p>
      Elevate your learning journey with Condense's innovative features. Our AI-generated video summaries boost efficiency, helping you save up to 60% of your time. Effortlessly navigate through content with concise summaries, timestamped highlights, and crucial insights.
      Furthermore, Condense offers seamless integration with AI-powered Q&A and a note-taking assistant, making knowledge reinforcement effortless. With a single click, you can permanently save your learning materials in your Note Library, ensuring they're readily accessible for future reference in your workspace.
      Discover a wide variety of YouTube video transformations in the Condense Video Library, where valuable insights are just a click away. Our cutting-edge technology quickly evaluates video quality, letting you concentrate on what's important. Transform your content consumption with Condense – where YouTube videos are effortlessly turned into informative articles. Try Condense's YouTube Video to Article Converter today and start a superior content discovery journey.
    </p>
      <button>Explore Your Workspace</button>
      <button>
      {/* <img src="/images/newchrome.png" alt="ChromeLogo" className="chrome-logo" />  */}

        Try Our Extension</button>
    </section>
  );
}

function ExploreByCategory() {
  return (
    <section className={styles.categories}>
      <Category
        title="Philosophy and Science"
        summaryCount="25"
        imageSrc="/images/phil.png"
        // Other props like image and description
        />
      <Category
        title="Climate Change and Sustainability"
        summaryCount="25"
        imageSrc="/images/mrbeast.png"
        // Other props like image and description
        />
      <Category
        title="Artificial Intelligence and Ethics"
        summaryCount="2"
        imageSrc="/images/ethical_ted.png"
        // Other props like image and description
      />
      {/* Add more categories as needed */}
    </section>
  );
}

// function Category({ title, summaryCount }) {
//   return (
//     <div className="category">
//       <h2>{title}</h2>
//       <span>{summaryCount} Summaries</span>
//       <button>View YouTube Summary</button>
//       {/* Image and other content */}
//     </div>
//   );
// }

function Category({ title, summaryCount, imageSrc }) {
  return (
    <div className={styles["category-card"]}>
      {imageSrc && <img src={imageSrc} alt={styles.title} className={styles["category-image"]} />}
      <div className={styles["card-content"]}>
        <h2>{title}</h2>
        <span>{summaryCount} Summaries</span>
        <button>View YouTube Summary</button>
      </div>
    </div>
  );
}


function Footer() {
  // Your footer content goes here
  return <footer>©2025. Copyright By Condense</footer>;
}


export default Aa;


