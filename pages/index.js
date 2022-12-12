import  { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [ apiOutput, setApiOutput] = useState();
  const [isGenerating, setIsGenerating] = useState(false);


  const callGenerateEndpoint = async () => {
    setIsGenerating(true)
    const response = await fetch('api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput })
    });

    const data = await response.json();
    console.log(data)

    setApiOutput(data);
    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>Brain Stormer</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Brainstormer</h1>
          </div>
          <div className="header-subtitle">
            <h2>Get your next startup idea</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea placeholder="Give me one startup idea based on X in the Y sector." className="prompt-box" value={userInput} onChange={onUserChangedText} />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={callGenerateEndpoint}>
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <div>
                  <h1>Your Startup Name: <span className='startup-name'>{apiOutput.name}</span></h1>
                  <div className='data-section'>
                    <p className='question-title'>Idea:</p>
                    <p>{apiOutput.idea}</p>
                  </div>
                  <div className='data-section'>
                    <p className='question-title'>How will the above idea impact the healthcare market:</p>
                    <p>{apiOutput.marketInfo}</p>
                  </div>
                  <div className='data-section'>
                    <p className='question-title'>What problems does this idea really solves:</p>
                    <p>{apiOutput.problemSolve}</p>
                  </div>
                  <div className='data-section'>
                    <p className='question-title'>How this impacts common people:</p>
                    <p>{apiOutput.impact}</p>
                  </div>
                  <div className='data-section'>
                    <p className='question-title'>Any companies working on this idea:</p>
                    <p>{apiOutput.existingCompany}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
