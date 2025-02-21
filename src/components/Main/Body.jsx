import React, { useContext, useState, useEffect } from "react";
import "./body.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import bot from "../../assets/bot.png";
import send from "../../assets/send_icon.png";
import { Context } from "../../Context/Context";

const Body = () => {
  const {
    text,
    setText,
    onSent,
    translateResultData,
    summarizeText,
    showResult,
    setShowResult,
    availableLanguages,
    detectedLanguage,
    loading,
    translatedText,
    selectedLanguage
  } = useContext(Context);

  const [messages, setMessages] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleSend = async () => {
    if (!text.trim()) return;

    const detectedLangFull =
      availableLanguages.find((lang) => lang.code === detectedLanguage)?.name || "Unknown";

    const newMessage = {
      userText: text,
      detectedLanguage: detectedLangFull,
      aiResponse: "Generating response...",
      translation: "",
      summary: "",
      loading: true,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");
    setShowResult(true);
    onSent();

    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          aiResponse: "AI Response for: " + newMessage.userText,
          loading: false,
        };
        return updated;
      });
    }, 3000);
  };

  const handleTranslate = async (index, language) => {
    setLoadingIndex(index);
    const translatedText = await translateResultData(messages[index].aiResponse, language);

    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        translation: {
          ...updated[index].translation,
          [language]: translatedText,
        },
      };
      setLoadingIndex(null);
      return updated;
    });
  };

  const handleSummarize = async (index) => {
    if (messages[index].aiResponse.length < 150) return;

    setLoadingIndex(index);
    const summarizedText = await summarizeText(messages[index].aiResponse);
    setMessages((prev) => {
      const updated = [...prev];
      updated[index].summary = summarizedText;
      setLoadingIndex(null);
      return updated;
    });
  };


  const handleLanguageSelection = async (index, selectedLanguage) => {
    if (!selectedLanguage) return;

    setLoadingIndex(index);
    const translatedText = await translateResultData(messages[index].aiResponse, selectedLanguage);

    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        translation: {
          ...updated[index].translation,
          [selectedLanguage]: translatedText,
        },
      };
      setLoadingIndex(null);
      return updated;
    });
  };
  const handleClearChat = () => {
    setMessages([]);
    setShowResult(false);
    setText("");
  };

  return (
    <div className="body">
      <div className="nav">
        <h2>TextAi</h2>

        <button className="button1" onClick={handleClearChat}>
          Clear Chat
        </button>


      </div>
      <div className="body-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>AI-Powered Text Processing Interface</span>
              </p>
              <p className="para">
                Unlock the full potential of text with our AI-powered interface—a smart, seamless
                tool designed to enhance your text-handling experience.
              </p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Detect Languages Instantly</p>
              </div>
              <div className="card">
                <p>Translate with Ease</p>
              </div>
              <div className="card">
                <p>Summarize Effortlessly</p>
              </div>
              <div className="card">
                <p>Summarize</p>
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            {loading ? (
              <div className="loader">
                <hr />
                <hr />
                <hr />
              </div>
            ) : (
              <div className="chats">
                {messages.map((msg, index) => (
                  <div key={index}>
                    <div className="input-user">
                      {/* <img src={user} alt="User" className="user" /> */}
                      <div className="user-prompts">

                        <p>{msg.userText}</p>

                        <div className="bottom-data">
                          <p>

                            {msg.detectedLanguage && (
                              <span className="lang-tag">({msg.detectedLanguage})</span>
                            )}
                          </p>

                          <div className="output-button">
                            <button
                              onClick={() => handleSummarize(index)}
                              className="button2"
                              disabled={!msg.aiResponse || msg.aiResponse.length < 150}
                            >
                              Summarize
                            </button>



                            <select
                              className="button1"
                              onChange={(e) => handleLanguageSelection(index, e.target.value)}
                            >
                              <option value="" hidden>Translate</option>
                              {availableLanguages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                  {lang.name}
                                </option>
                              ))}
                            </select>

                            <p className="time">{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <p className="ai-ans">{msg.aiResponse}</p> */}
                    {msg.translation && Object.keys(msg.translation).length > 0 && (
                      <div className="summary">
                        <img src={bot} alt="User" className="user" />
                        <div className="ai-ans">
                          {Object.entries(msg.translation).map(([lang, trans]) => (
                            <p key={lang}>{trans || "Translation not available"}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.summary && (
                      <div className="summary">
                        <img src={bot} alt="User" className="user" />
                        <p className="ai-ans">
                          Summarized: {msg.summary} <br />
                          <span className="time">{msg.time}</span>
                        </p>
                      </div>
                    )}

                    {loadingIndex === index && (
                      <div className="loading-container">
                        <div className="spinner"></div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="body-bottom">
          <div className="search-box">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Enter a prompt here"
            />

            <div className="output-button">

              {text && (
                <div className="button1">
                  <img onClick={handleSend} src={send} alt="Send" />
                </div>
              )}
            </div>
          </div>
          <p className="bottom-info">
            If you want to summarize, you must input at least 150 words
          </p>
        </div>
      </div>
    </div>
  );
};

export default Body;
