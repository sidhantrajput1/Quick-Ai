import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Mock generated titles
    const titles = [
      `Top Trends in ${selectedCategory} for 2025`,
      `How ${input || "AI"} is Transforming the ${selectedCategory} Industry`,
      `Beginner’s Guide to ${selectedCategory}: What You Should Know`,
    ];

    setGeneratedTitles(titles);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <div className="min-w-[300px]">
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#4A7AFF]" />
            <h2 className="text-xl font-semibold">AI Title Generator</h2>
          </div>

          <p className="mt-6 text-sm font-medium">Keyword</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="The future of artificial intelligence..."
            required
          />

          <p className="mt-4 text-sm font-medium">Category</p>
          <div className="mt-3 flex gap-3 flex-wrap sm:max-w-[90%]">
            {blogCategories.map((item) => (
              <span
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                  selectedCategory === item
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "text-gray-500 border-gray-300 hover:bg-blue-100"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
          >
            <Hash className="w-5 h-5" />
            Generate Title
          </button>
        </form>
      </div>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem]">
        <div className="flex items-center gap-3 mb-4">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h2 className="text-xl font-semibold">Generated Titles</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {generatedTitles.length > 0 ? (
            <ul className="list-disc ml-5 text-sm text-slate-700 space-y-2">
              {generatedTitles.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter a keyword and click "Generate Title" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
