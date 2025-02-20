import { createContext, useState, useEffect } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [recents, setRecents] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [summaryButton, setSummaryButton] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState([]); 
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detector, setDetector] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("pt");
  const [showLanguages, setShowLanguages] = useState(false);
  const [summarizedText, setSummarizedText] = useState(""); 

  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Portuguese" },
    { code: "es", name: "Spanish" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
    { code: "fr", name: "French" },
  ];

  useEffect(() => {
    async function initializeDetector() {
      try {
        const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
        const canDetect = languageDetectorCapabilities.capabilities;

        if (canDetect === "no") {
          setStatus("Language detection not available.");
          return;
        }

        if (canDetect === "readily") {
          const detectorInstance = await self.ai.languageDetector.create();
          setDetector(detectorInstance);
          setStatus("Language detector is ready.");
        } else {
          const detectorInstance = await self.ai.languageDetector.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });

          await detectorInstance.ready;
          setDetector(detectorInstance);
          setStatus("Language detector is ready after download.");
        }
      } catch (error) {
        console.error("Error initializing language detector:", error);
        setStatus("Error initializing language detector.");
      }
    }

    initializeDetector();
  }, []);

  useEffect(() => {
    const detectLanguage = async () => {
      if (detector && text.trim().length > 0) {
        try {
          const results = await detector.detect(text);
          if (results.length > 0) {
            setDetectedLanguage(results[0].detectedLanguage);
          }
        } catch (error) {
          console.error("Error detecting language:", error);
        }
      }
    };

    detectLanguage();
  }, [text, detector]);

  const translateResultData = async (textToTranslate, language) => {
    if (!textToTranslate || !language) return "Translation failed. Please try again.";
    try {
      const translator = await self.ai.translator.create({
        sourceLanguage: "en",
        targetLanguage: language,
      });
      const translated = await translator.translate(textToTranslate);
      return translated;
    } catch (error) {
      console.error("Translation failed:", error);
      return "Translation failed. Please try again.";
    }
  };


  useEffect(() => {
    if (translatedText) {
      console.log("Translated text updated:", translatedText);
    }
  }, [translatedText]);

  const summarizeText = async (textToSummarize) => {
    try {
      const options = {
        sharedContext: "This is a scientific article",
        type: "key-points",
        format: "markdown",
        length: "medium",
      };
  
      const available = (await self.ai.summarizer.capabilities()).available;
      if (available === "no") {
        console.log("The Summarizer API isn't usable.");
        return;
      }
  
      let summarizer;
      if (available === "readily") {
        summarizer = await self.ai.summarizer.create(options);
      } else {
        summarizer = await self.ai.summarizer.create(options);
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }
  
      const summary = await summarizer.summarize(textToSummarize);
      setSummarizedText(summary); 
      return summary;
    } catch (error) {
      console.error("Summarization failed:", error);
    }
  };
  

  const onSent = async () => {
    if (!text.trim()) return;
  
    const sentText = text;
    setText("");
    setLoading(true);
    setShowResult(true);
  
    setTimeout(async () => {
      setLoading(false);
      setResultData((prev) => [...prev, sentText]);
      setPrevPrompt((prev) => [...prev, sentText]);
  
 
      const translationResult = await translateResultData(sentText);
      setTranslatedText((prev) => ({ ...prev, ...translationResult })); 
    }, 5000);
  };
  
  
 

  const contextValue = {
    text,
    setText,
    detectedLanguage,
    recents,
    setRecents,
    prompt,
    setPrompt,
    summaryButton,
    setSummaryButton,
    setShowResult,
    showResult,
    resultData,
    setResultData,
    prevPrompt,
    setPrevPrompt,
    loading,
    setLoading,
    onSent,
    translateResultData,
    selectedLanguage,
    setSelectedLanguage,
    showLanguages,
    setShowLanguages,
    availableLanguages,
    translatedText, 
    setTranslatedText,
    summarizeText, 
    summarizedText, 
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
