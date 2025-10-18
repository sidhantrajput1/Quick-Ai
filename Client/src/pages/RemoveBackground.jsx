import { Eraser, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-xl font-semibold">Background Removal</h2>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Images</p>
          <input
            type="file"
            onChange={(e) => setInput(e.target.files[0])}
            className="w-full p-2 mt-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
            required
            accept="image/*"
          />

          <p className="text-xs text-gray-500 font-light mt-1">
            Supports JPG, PNG and others image formate
          </p>
          <button
            disabled={loading}
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin "></span>
            ) : (
              <Eraser className="w-5 h-5" />
            )}
            Remove Background
          </button>
        </form>
      </div>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem]">
        <div className="flex items-center gap-3 mb-4">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h2 className="text-xl font-semibold">Processed Image</h2>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" alt="Placeholder" />
              <p>
                Upload an image and click "Remove Background" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="mt-3 h-full">
              <img src={content} alt="" className="w-full h-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
