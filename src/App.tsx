import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, X, Command } from "lucide-react";
import * as math from "mathjs";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input on mount and when window might become visible
    inputRef.current?.focus();
  }, []);

  const evaluateMath = (val: string) => {
    if (!val.trim()) {
      setResult(null);
      setError(false);
      return;
    }

    try {
      const res = math.evaluate(val);
      if (typeof res === "function") {
        setResult(null);
        setError(false);
      } else {
        setResult(res.toString());
        setError(false);
      }
    } catch (e) {
      setError(true);
      setResult(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    evaluateMath(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setInput("");
      setResult(null);
      setError(false);
    }
  };

  return (
    <motion.div
      className="eval-container"
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="eval-bar">
        <div className="eval-icon">
          <Calculator size={20} strokeWidth={2.5} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Calculate something..."
          spellCheck={false}
          autoComplete="off"
        />

        <AnimatePresence mode="wait">
          {result !== null && (
            <motion.div
              key="result"
              className="eval-result"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="eval-separator" />
              <span className="result-text">{result}</span>
            </motion.div>
          )}
          {error && input.length > 0 && (
            <motion.div
              key="error"
              className="eval-error-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="eval-separator" />
              <X size={16} color="#ff4d4d" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="eval-hint">
          <Command size={14} />
          <span>Space</span>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
