import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <div className=" min-w-[300px]">
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#4A7AFF]" />
            <h2 className="text-xl font-semibold">Article Configuration</h2>
          </div>

          <p className="mt-6 text-sm font-medium">Article Topic</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="The future of artificial intelligence is..."
            required
          />

          <p className="mt-4 text-sm font-medium">Article Length</p>
          <div className="mt-3 flex gap-3 flex-wrap sm:max-w-[90%]">
            {articleLength.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedLength(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer hover:bg-blue-100 ${
                  selectedLength.text === item.text
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                {item.text}
              </span>
            ))}
          </div>

          <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition">
            <Edit className="w-5 h-5" />
            Generate Article
          </button>
        </form>
      </div>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem] max-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Generated Article</h2>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9" />
            <p>Enter a topic and click "Generate article" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
