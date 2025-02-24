// src/components/TypingTest.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const exampleCodes = {
  python: "print('Hello, World!')",
  javascript: "console.log('Hello, World!');",
  java: "System.out.println('Hello, World!');",
  c: "printf('Hello, World!');",
  cpp: "std::cout << 'Hello, World!';"
};

const CapsLockWarning = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6);
  z-index: 20;
`;

const CapsLockIcon = styled.div`
  font-size: 36px;
  margin-bottom: 10px;
`;

const BlurContainer = styled.div`
  transition: filter 0.3s ease;
  filter: ${props => props.blurred ? 'blur(5px)' : 'none'};
`;

const TopControls = styled.div`
  display: flex;
  gap: 25px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const StyledSelect = styled.select`
  background: #2a2a2a;
  color: #ddd;
  border: 1px solid #333;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #333;
  }
`;

const CodeContainer = styled.div`
  font-size: 22px;
  color: #666;
  white-space: pre;
  margin: 20px 0;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  text-align: left;
`;

const DisplaySpan = styled.span`
  color: ${props => props.correct ? '#fff' : props.incorrect ? '#ff5555' : '#666'};
`;

const TypingTest = () => {
  const [language, setLanguage] = useState('python');
  const [codeText, setCodeText] = useState(exampleCodes.python);
  const [userInput, setUserInput] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!typingStarted) {
        setTypingStarted(true);
      }

      if (event.getModifierState("CapsLock")) {
        setCapsLockOn(true);
      } else if (capsLockOn) {
        setCapsLockOn(false);
      }

      if (event.key.length === 1) {
        setUserInput(prev => prev + event.key);
      } else if (event.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [typingStarted, capsLockOn]);

  const loadCode = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCodeText(exampleCodes[selectedLanguage]);
    setUserInput('');
    setErrorCount(0);
    setTypingStarted(false);
  };

  const renderCode = () => {
    return codeText.split('').map((char, index) => {
      if (index < userInput.length) {
        return (
          <DisplaySpan
            key={index}
            correct={userInput[index] === char}
            incorrect={userInput[index] !== char}
          >
            {char}
          </DisplaySpan>
        );
      }
      return <DisplaySpan key={index}>{char}</DisplaySpan>;
    });
  };

  return (
    <>
      <CapsLockWarning show={capsLockOn} onClick={() => setCapsLockOn(false)}>
        <CapsLockIcon>🔒</CapsLockIcon>
        Caps Lock is ON! Turn it off.<br />Click to continue.
      </CapsLockWarning>
      <BlurContainer blurred={capsLockOn}>
        <TopControls>
          <label>Timer:</label>
          <StyledSelect>
            <option value="15">15 sec</option>
            <option value="30">30 sec</option>
            <option value="60">60 sec</option>
            <option value="120">120 sec</option>
          </StyledSelect>
          <label>Language:</label>
          <StyledSelect
            value={language}
            onChange={(e) => loadCode(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </StyledSelect>
        </TopControls>
        <div>Time Left: {timeLeft}s</div>
      </BlurContainer>
      <div>Errors: {errorCount}</div>
      <CodeContainer>{renderCode()}</CodeContainer>
    </>
  );
};

export default TypingTest;