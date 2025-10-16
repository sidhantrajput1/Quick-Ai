import React, { useState } from "react";
import { FileText, FileTextIcon, Scissors, Sparkles } from "lucide-react";


const ReviewResume = () => {
  const [input, setInput] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
            <Sparkles className="w-6 h-6 text-[#00DA83]" />
            <h2 className="text-xl font-semibold">Resume Review</h2>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Resume</p>
          <input
            type="file"
            onChange={(e) => setInput(e.target.files[0])}
            className="w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
            required
            accept="application/pdf"
          />

          <p className="mt-1 text-xs text-gray-500 font-medium">
            Supports pdf resume only
          </p>


          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
          >
            <FileTextIcon className="w-5 h-5" />
            Review Resume
          </button>
        </form>
      </div>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem]">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h2 className="text-xl font-semibold">Analysis Result</h2>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <FileText className="w-9 h-9" />
            <p>Upload an Resume and click "Review Resume" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
