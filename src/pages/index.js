import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const LottieScrollSection = dynamic(() => import('../components/LottieScrollSection'), { ssr: false });

export default function Home() {
 return (
    <div>
      <Head>
        <title>Lottie Scroll Animation Page</title>
        <meta name="description" content="A page with Lottie scroll animation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className="dummy-section" style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
          <h1 className='text-9xl text-black'>Section 1</h1>
        </section>

        <LottieScrollSection />

        <section className="dummy-section" style={{ height: '100vh', backgroundColor: '#e0e0e0' }}>
        <h1 className='text-9xl text-black'>Section 3</h1>
        </section>
      </main>

      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        .dummy-section {
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        .lottie-section {
          height: 300vh; /* Increased to allow for scrolling */
          position: relative;
        }
        .lottie-container {
          height: 100vh;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: black;
        }
        .lottie-animation {
          width: 80vw;
          height: 80vh;
        }
      `}</style>
    </div>
  );
};