import { Picture, PictureSize } from "@/api/picture";
import classNames from "@/classNames";

export default function PictureComponent({ value }: { value?: Picture }) {
  let pictureSize: PictureSize | undefined;
  for (const size of value?.sizes || []) {
    pictureSize = size;
    if (size.height >= 400 || size.width >= 400) break;
  }
  return (
    <div className="relative h-fit w-fit p-4 mt-2 mr-2 row-start-3 col-span-full col-start-2 bg-white rounded-md shadow-md">
      {value && pictureSize ? (
        <img
          src={pictureSize?.source}
          width={pictureSize?.width}
          height={pictureSize?.height}
          className={classNames(
            "rounded-sm max-w-[unset] max-h-[unset",
            pictureSize.width > pictureSize.height ? "w-[400px]" : "h-[400px]"
          )}
          alt=""
        />
      ) : (
        <div className="h-[400px] w-[400px] rounded-sm bg-gray-100"></div>
      )}

      {value && (
        <div className="flex justify-between gap-4 mt-2 text-gray-600">
          <a
            href={value?.ownerWebpage}
            target="_blank"
            className="flex gap-2 items-center"
          >
            <img src={value?.ownerIcon} alt="" className="h-6 w-6 rounded-sm" />
            <span className="text-sm underline text-blue-800">
              {value?.ownerUsername}
            </span>
          </a>
          <div className="flex gap-2 text-sm">
            <a
              className="underline text-blue-800"
              href={value?.url}
              target="_blank"
            >
              View original image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
