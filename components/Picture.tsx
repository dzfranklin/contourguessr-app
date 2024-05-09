import classNames from "@/classNames";
import { useState } from "react";
import ArrowsPointingOutIcon from "@heroicons/react/20/solid/ArrowsPointingOutIcon";
import ArrowsPointingInIcon from "@heroicons/react/20/solid/ArrowsPointingInIcon";
import { useChallenge } from "@/hooks/useChallenge";

export default function PictureComponent() {
  const {
    data: { src, photographer, link },
  } = useChallenge();
  const [showLarge, setShowLarge] = useState(false);
  const size = showLarge ? src.large : src.regular;
  return (
    <div
      className={
        showLarge
          ? "fixed inset-5 z-50 pointer-events-none"
          : "w-[400px] h-[400px] mt-2 mr-2 row-start-3 col-span-full col-start-2"
      }
    >
      <div
        className={classNames(
          "ml-auto relative pointer-events-auto max-w-full max-h-full bg-white rounded-md overflow-clip shadow-md"
        )}
        style={
          size
            ? {
                aspectRatio: `${size.width}/${size.height}`,
              }
            : {
                aspectRatio: "1/1",
              }
        }
      >
        {size ? (
          <img
            src={size.src}
            width={size.width}
            height={size.height}
            alt=""
            className={classNames("w-full h-full object-contain")}
          />
        ) : (
          <div className="h-[400px] w-[400px] bg-gray-100"></div>
        )}

        <button
          onClick={() => setShowLarge((p) => !p)}
          className="absolute top-0 right-0 p-1.5 m-1 bg-[rgba(0,0,0,0.2)] rounded-full text-white"
          title={showLarge ? "Smaller" : "Larger"}
        >
          {showLarge ? (
            <ArrowsPointingInIcon className="w-4" />
          ) : (
            <ArrowsPointingOutIcon className="w-4" />
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-2 grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-1 gap-2 items-center bg-[rgba(255,255,255,0.6)] text-gray-600 text-sm">
          <img src={photographer.icon} alt="" className="h-6 w-6 rounded-sm" />
          <a
            href={photographer.link}
            target="_blank"
            className="shrink text-blue-900 underline mr-6 truncate"
          >
            {photographer.text}
          </a>
          <a
            className="text-blue-900 underline ml-auto"
            href={link}
            target="_blank"
          >
            Original image
          </a>
        </div>
      </div>
    </div>
  );
}
