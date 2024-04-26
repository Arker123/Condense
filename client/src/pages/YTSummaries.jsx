import React from 'react';
// Importing styles object from CSS module
import styles from "./YTSummaries.module.css";

function YTSummaries() {
  return (
    // Use styles object for className
    <div className={styles.YTSummaries}>
      <YTHeader />
      <MainContent />
    </div>
  );
}

function YTHeader() {
  return (
    // Use styles object for className
    // <header className={styles.YTheader}>
    <header className="flex flex-row gap-4 items-center justify-center mt-5">
      {/* <img src="/images/logo_condense.jpg" alt="Logo" className={styles.YTheaderLogo} />  */}
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
      <img
                src={"/images/white-logo.svg"}
                alt="Your Image Alt Text"
                className="w-full h-full object-cover"
              />
              </div>
      <p className='text-[30px] text-slate-50 font-sans font-extrabold mt-1'>Condense</p>
    </header>
  );
}

function MainContent() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <ExploreByCategory />
    </main>
  );
}

function HeroSection() {
  return (
    // Use styles object for className
    <section className={`${styles.hero} rounded-xl`}>
      <h1>YouTube Summaries</h1>
      <p>
      Elevate your learning journey with Condense's innovative features. Our AI-generated video summaries boost efficiency, helping you save up to 60% of your time. Effortlessly navigate through content with concise summaries, timestamped highlights, and crucial insights.
      Furthermore, Condense offers seamless integration with AI-powered Q&A and a note-taking assistant, making knowledge reinforcement effortless. With a single click, you can permanently save your learning materials in your Note Library, ensuring they're readily accessible for future reference in your workspace.
      Discover a wide variety of YouTube video transformations in the Condense Video Library, where valuable insights are just a click away. Our cutting-edge technology quickly evaluates video quality, letting you concentrate on what's important. Transform your content consumption with Condense – where YouTube videos are effortlessly turned into informative articles. Try Condense's YouTube Video to Article Converter today and start a superior content discovery journey.
      </p>
      <button className={styles.heroButton}>Explore Your Workspace</button>
      <button className={styles.heroButton}>Try Our Extension</button>
    </section>
  );
}

function ExploreByCategory() {
  return (
    // Use styles object for className
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
      />
      {/* Add more categories as needed */}
    </section>
  );
}

function Category({ title, summaryCount, imageSrc }) {
  return (
    // Use styles object for className
    <div className={`${styles.categoryCard} h-[310px] hover:scale-105 transition-all duration-300 ease-in-out`}>
      {imageSrc && <img src={imageSrc} alt={title} className={`${styles.categoryImage} rounded-lg mb-3`}/>}
      <div className={`${styles.cardContent} flex flex-col`}>
        <h2 >{title}</h2>
        <span>{summaryCount} Summaries</span>
        <button className={`${styles.categoryButton} w-[240px] mb-3 ml-7`}>View YouTube Summary</button>
      </div>
    </div>
  );
}



export default YTSummaries;
