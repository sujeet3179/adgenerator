import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';
import './App.css';

// Add TypeScript definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface AdContent {
  headline: string;
  subheadline: string;
  tagline: string;
  bannerText: string;
  cta: string;
  textLines: string[];
  formats: string[];
  description: string;
}

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const adRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [adContent, setAdContent] = useState<AdContent>({
    headline: '',
    subheadline: '',
    tagline: '',
    bannerText: '',
    cta: '',
    textLines: [],
    formats: [],
    description: ''
  });
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [textColor, setTextColor] = useState<string>('#2d3748');
  const [textLineColor, setTextLineColor] = useState<string>('#4a5568');
  const [bannerTextColor, setBannerTextColor] = useState<string>('#ffffff');

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setPrompt(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const generateWithChatGPT = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setAdContent({
        ...data,
        bannerText: data.bannerText || 'Special Offer',
        textLines: data.textLines || []
      });
      setTitle(data.headline);
      setDescription(data.description);
      setSelectedFormat(data.formats && data.formats.length > 0 ? data.formats[0] : '');
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAd = () => {
    if (adRef.current) {
      html2canvas(adRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'ad-image.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const shareUrl = 'https://snappy.appypie.com/'; // Replace with your actual app or ad link
  const shareTitle = `${title} - ${description}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="app">
      <div className="top-banner">
        <div className="banner-content">
          <h2>AI-Powered Ad Generator</h2>
          <p>Create professional ads in seconds with the power of AI</p>
        </div>
      </div>
      
      <header>
        <h1>Ad Generator</h1>
      </header>

      <main>
        <div className="controls-container">
          <section className="ai-generator">
            <h2>Generate with AI</h2>
            <div className="ai-controls">
              <div className="voice-input-container">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your ad or use voice input..."
                  rows={4}
                />
                <div className="voice-button-container">
                  <button 
                    className={`voice-button ${isListening ? 'listening' : ''}`}
                    onClick={toggleListening}
                  >
                    {isListening ? 'Stop Recording' : 'Start Voice Input'}
                  </button>
                </div>
                {transcript && (
                  <div className="transcript-container">
                    <div className="transcript-label">Transcript:</div>
                    <div className="transcript-text">{transcript}</div>
                  </div>
                )}
              </div>
              <button 
                onClick={generateWithChatGPT}
                disabled={isGenerating || !prompt}
                className={isGenerating ? 'generating' : ''}
              >
                {isGenerating ? 'Generating...' : 'Generate with ChatGPT'}
              </button>
              {error && (
                <div className="error-message">
                  {error}
                  <div className="error-help">
                    <p>• Check if your OpenAI API key is valid</p>
                    <p>• Ensure the server is running</p>
                    <p>• Verify your internet connection</p>
                    <p>• Check the console for more details</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="controls">
            <h2>Ad Customization</h2>
            
            <div className="image-upload-section">
              <h3>Image & Background</h3>
              <div>
                <label htmlFor="image-upload">Upload Image</label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              
              <div className="color-input">
                <label htmlFor="background-color">Background Color</label>
                <div className="color-picker-container">
                  <input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
            
            <div className="basic-info-section">
              <h3>Basic Information</h3>
              
              <div>
                <label htmlFor="ad-title">Title</label>
                <input
                  id="ad-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ad Title"
                />
              </div>

              <div>
                <label htmlFor="ad-description">Description</label>
                <textarea
                  id="ad-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ad Description"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="color-customization">
              <h3>Text Colors</h3>
              <div className="color-input">
                <label htmlFor="text-color">Text Color</label>
                <div className="color-picker-container">
                  <input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#2d3748"
                  />
                </div>
              </div>
              <div className="color-input">
                <label htmlFor="text-line-color">Text Line Color</label>
                <div className="color-picker-container">
                  <input
                    id="text-line-color"
                    type="color"
                    value={textLineColor}
                    onChange={(e) => setTextLineColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={textLineColor}
                    onChange={(e) => setTextLineColor(e.target.value)}
                    placeholder="#4a5568"
                  />
                </div>
              </div>
            </div>
            
            <div className="ad-content-section">
              <h3>Ad Content</h3>
              
              <div>
                <label htmlFor="ad-headline">Headline</label>
                <input
                  id="ad-headline"
                  type="text"
                  value={adContent.headline}
                  onChange={(e) => setAdContent(prev => ({...prev, headline: e.target.value}))}
                />
              </div>

              <div>
                <label htmlFor="ad-subheadline">Subheadline</label>
                <input
                  id="ad-subheadline"
                  type="text"
                  value={adContent.subheadline}
                  onChange={(e) => setAdContent(prev => ({...prev, subheadline: e.target.value}))}
                />
              </div>

              <div>
                <label htmlFor="ad-tagline">Tagline</label>
                <input
                  id="ad-tagline"
                  type="text"
                  value={adContent.tagline}
                  onChange={(e) => setAdContent(prev => ({...prev, tagline: e.target.value}))}
                />
              </div>

              <div>
                <label htmlFor="ad-banner-text">Banner Text</label>
                <input
                  id="ad-banner-text"
                  type="text"
                  value={adContent.bannerText}
                  onChange={(e) => setAdContent(prev => ({...prev, bannerText: e.target.value}))}
                  placeholder="Special Offer"
                />
              </div>
              
              <div className="color-input">
                <label htmlFor="banner-text-color">Banner Text Color</label>
                <div className="color-picker-container">
                  <input
                    id="banner-text-color"
                    type="color"
                    value={bannerTextColor}
                    onChange={(e) => setBannerTextColor(e.target.value)}
                  />
                  <input
                    type="text"
                    value={bannerTextColor}
                    onChange={(e) => setBannerTextColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="text-lines-container">
                <label>Text Lines</label>
                {adContent.textLines.map((line, index) => (
                  <div key={index} className="text-line-input">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const newTextLines = [...adContent.textLines];
                        newTextLines[index] = e.target.value;
                        setAdContent(prev => ({...prev, textLines: newTextLines}));
                      }}
                      placeholder={`Text line ${index + 1}`}
                    />
                    <button 
                      className="remove-line-button"
                      onClick={() => {
                        const newTextLines = adContent.textLines.filter((_, i) => i !== index);
                        setAdContent(prev => ({...prev, textLines: newTextLines}));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  className="add-line-button"
                  onClick={() => {
                    setAdContent(prev => ({
                      ...prev, 
                      textLines: [...prev.textLines, ""]
                    }));
                  }}
                >
                  + Add Text Line
                </button>
              </div>

              <div>
                <label htmlFor="ad-cta">Call to Action</label>
                <input
                  id="ad-cta"
                  type="text"
                  value={adContent.cta}
                  onChange={(e) => setAdContent(prev => ({...prev, cta: e.target.value}))}
                />
              </div>

              <div>
                <label htmlFor="ad-format">Ad Format</label>
                <select
                  id="ad-format"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  {(adContent.formats || []).map((format, index) => (
                    <option key={index} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={downloadAd}
              className="download-button"
            >
              Download Ad Image
            </button>
          </section>
        </div>

        <section 
          className="ad-preview" 
          ref={adRef}
          style={{ backgroundColor: backgroundColor }}
        >
          {image ? (
            <img src={URL.createObjectURL(image)} alt="Uploaded Ad" />
          ) : (
            <div className="image-placeholder">
              Upload an image to preview your ad
            </div>
          )}
          {adContent && (
            <div className="ad-content" style={{ color: textColor }}>
              {adContent.bannerText && (
                <div className="banner-text" style={{ color: bannerTextColor }}>
                  {adContent.bannerText}
                </div>
              )}
              <h2>{adContent.headline}</h2>
              <h3>{adContent.subheadline}</h3>
              <div className="tagline">{adContent.tagline}</div>
              {adContent.textLines.map((line, index) => (
                <div 
                  key={index} 
                  className="text-line"
                  style={{ color: textLineColor }}
                >
                  {line}
                </div>
              ))}
              <p>{adContent.description}</p>
              <div className="cta-button">{adContent.cta}</div>
              <div className="format-badge">{selectedFormat}</div>
            </div>
          )}
        </section>

        <section className="share-buttons">
          <h3>Share this Ad</h3>
          <div className="share-icons">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <EmailShareButton url={shareUrl} subject="Check this ad!" body={shareTitle}>
              <EmailIcon size={32} round />
            </EmailShareButton>

            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <button
              onClick={handleCopyLink}
              className="copy-link-button"
              aria-label="Copy link"
            >
              🔗
              {isCopied && (
                <span className="copy-tooltip">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
