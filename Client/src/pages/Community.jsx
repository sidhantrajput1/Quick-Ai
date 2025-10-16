import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData);
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold text-slate-700">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:w-1/2 lg:w-1/3"
          >
            <img
              src={creation.content}
              alt="AI Creation"
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Hover overlay */}
            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm text-white px-3 text-center">
                {creation.prompt}
              </p>

              <div className="flex gap-1 items-center">
                <p>{creation.likes?.length || 0}</p>
                <Heart
                  className="min-w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
