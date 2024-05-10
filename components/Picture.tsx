import classNames from "@/classNames";
import { useMemo, useState } from "react";
import ArrowsPointingOutIcon from "@heroicons/react/20/solid/ArrowsPointingOutIcon";
import ArrowsPointingInIcon from "@heroicons/react/20/solid/ArrowsPointingInIcon";
import { useChallenge } from "@/hooks/useChallenge";
import santizeHtml from "sanitize-html";

// Useful examples:
// - long description: http://localhost:3000/c/kuhq

export default function PictureComponent({
  showDescription,
}: {
  showDescription: boolean;
}) {
  const {
    data: {
      src,
      photographer,
      link,
      title,
      description_html: untrustedDescription,
    },
  } = useChallenge();
  const description = useSantizedDescription(untrustedDescription);
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
            // Don't reuse the node if the src changes because the size will
            // change immediately but it'll keep the old src as the new one
            // loads.
            key={size.src}
          />
        ) : (
          <div className="h-[400px] w-[400px] bg-gray-100"></div>
        )}

        <div
          className={classNames(
            "absolute bottom-0 left-0 right-0 flex flex-col gap-1 max-h-full bg-[rgba(255,255,255,0.7)] text-gray-900 text-sm",
            showLarge ? "p-4" : "p-2"
          )}
        >
          {showDescription && (
            <>
              <div className="font-semibold">{title}</div>
              <div
                className={classNames(
                  "mb-2 prose prose-sm max-w-none whitespace-break-spaces leading-snug max-h-full",
                  showLarge ? "" : "line-clamp-2"
                )}
                dangerouslySetInnerHTML={description}
              />
            </>
          )}
          <div className="flex gap-2">
            <img
              src={photographer.icon}
              alt=""
              className="h-6 w-6 rounded-sm"
            />
            <a
              href={photographer.link}
              target="_blank"
              className="shrink text-blue-900 underline mr-6 truncate"
            >
              {photographer.text}
            </a>
            <a
              className="text-blue-900 underline ml-auto whitespace-nowrap"
              href={link}
              target="_blank"
            >
              Original image
            </a>
          </div>
        </div>

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
      </div>
    </div>
  );
}

function useSantizedDescription(untrusted: string): { __html: string } {
  return useMemo(() => {
    const trusted = santizeHtml(untrusted, {
      allowProtocolRelative: false,
      transformTags: {
        a: (tagName, attribs) => {
          if (attribs.href?.startsWith("http")) {
            return {
              tagName,
              attribs: {
                ...attribs,
                target: "_blank",
                rel: "noopener noreferrer",
              },
            };
          } else {
            return { tagName, attribs };
          }
        },
      },
    });
    return { __html: trusted };
  }, [untrusted]);
}
