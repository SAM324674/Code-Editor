import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";

const Home = () => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [editorInstance, setEditorInstance] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const testCases = [
    { input: [2, 3], expected: 5 },
    { input: [10, -2], expected: 8 },
  ];

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: "// Write your function here...",
        language: language,
        theme: "vs-dark",
      });
      setEditorInstance(editor);
      return () => editor.dispose();
    }
  }, [language]);

  useEffect(() => {
    if (editorInstance) {
      monaco.editor.setModelLanguage(editorInstance.getModel(), language);
    }
  }, [language, editorInstance]);

  const handleSubmit = async () => {
    const code = editorInstance.getValue();

    try {
    //   const response = await fetch("/run-code", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ code, language, testCases }),
    //   });
    //   const results = await response.json();
    //   setTestResult(results);
    console.log(code , language ,testCases)
    } catch (err) {
      setTestResult([{ error: err.message }]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full flex h-3/4">
        {/* Left Section for Question */}
        <div className="w-1/2 h-full p-8 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Problem Statement</h1>
          <p className="text-lg mb-4">
            Write a function called <strong>sum</strong> that takes two numbers and returns their sum.
          </p>
          <pre className="bg-gray-200 p-4 rounded-md text-sm mb-4">
            <code>
              sum(2, 3) // returns 5
              <br />
              sum(10, -2) // returns 8
            </code>
          </pre>
          <p className="text-lg font-semibold">Test Cases:</p>
          <ul className="list-disc list-inside text-sm">
            {testCases.map((test, idx) => (
              <li key={idx}>
                Input: <code>{JSON.stringify(test.input)}</code>, Expected Output: <code>{test.expected}</code>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section for Code Editor */}
        <div className="w-1/2 h-full p-8 flex flex-col">
          {/* Language Selector */}
          <div className="mb-4">
            <label htmlFor="language-select" className="mr-2 text-lg font-medium text-gray-800">
              Select Language:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          {/* Code Editor */}
          <div
            ref={editorRef}
            className="flex-grow w-full h-96 border-2 border-gray-300 rounded-md shadow-lg"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors"
          >
            Submit Code
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="mt-6 p-8">
          <h2 className="text-xl font-bold">Test Results:</h2>
          <ul className="list-inside list-decimal">
            {testResult.map((result, idx) =>
              result.error ? (
                <li key={idx} className="text-red-600">
                  Error: {result.error}
                </li>
              ) : (
                <li key={idx}>
                  <span>Test Case {result.testCase} - </span>
                  Input: <code>{JSON.stringify(result.input)}</code>, Output: <code>{result.output}</code>, Expected: <code>{result.expected}</code>{" "}
                  {result.passed ? (
                    <span className="text-green-600">[Passed]</span>
                  ) : (
                    <span className="text-red-600">[Failed]</span>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
