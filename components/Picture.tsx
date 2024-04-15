import { Picture, PictureSize } from "@/api/picture";

export default function PictureComponent({
  value: value,
}: {
  value?: Picture;
}) {
  let pictureSize: PictureSize | undefined;
  for (const size of value?.sizes || []) {
    pictureSize = size;
    if (size.width >= 1024) break;
  }
  return (
    <div className="p-4 rounded-md shadow-md w-fit">
      {value ? (
        <img
          src={pictureSize?.source}
          width={pictureSize?.width}
          height={pictureSize?.height}
          className="max-w-[1024px] max-h-[70vh] w-full rounded-sm"
          alt=""
        />
      ) : (
        <div className="w-[1024px] max-w-full h-[682px] rounded-sm bg-gray-100"></div>
      )}

      {value && (
        <div className="flex justify-between mt-2 text-gray-600">
          <div className="flex gap-2 items-center">
            <img src={value?.ownerIcon} alt="" className="h-6 w-6 rounded-sm" />
            <span className="text-sm">{value?.ownerUsername}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <a className="underline text-blue-800" href={value?.url}>
              Visit image source
            </a>
            <span className="text-gray-500">{value?.dateTaken}</span>
          </div>
        </div>
      )}
    </div>
  );
}
