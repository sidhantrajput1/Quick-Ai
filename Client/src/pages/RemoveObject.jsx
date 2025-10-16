import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");

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
            <Sparkles className="w-6 h-6 text-[#FF4938]" />
            <h2 className="text-xl font-semibold">Object Removal</h2>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Images</p>
          <input
            type="file"
            onChange={(e) => setInput(e.target.files[0])}
            className="w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
            required
            accept="image/*"
          />

          <p className="mt-6 text-sm font-medium">Describe object name to remove</p>

          <textarea
            rows={4}
            value={object}
            onChange={(e) => setObject(e.target.value)}
            className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="e.g., watch or spoon, only single object name"
            required
          />

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
          >
            <Scissors className="w-5 h-5" />
            Remove Object
          </button>
        </form>
      </div>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem]">
        <div className="flex items-center gap-3 mb-4">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Processed Image</h2>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-9 h-9"  />
            <p>Upload an image and click "Remove Object" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
