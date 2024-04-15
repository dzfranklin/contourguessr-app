import { Region } from "@/api/region";
import RegionSelectorComponent from "./RegionSelector";

export default function ControlsComponent({
  region: region,
  setRegion: setRegion,
  regions: regions,
  newPicture: newPicture,
}: {
  region: string;
  setRegion: (value: string) => void;
  regions: Region[];
  newPicture: () => void;
}) {
  return (
    <div className="flex gap-3 items-center mb-4">
      <div className="mr-3">
        <RegionSelectorComponent
          selected={region}
          setSelected={setRegion}
          regions={regions}
        />
      </div>

      <ControlButton onClick={() => newPicture()}>New picture</ControlButton>
    </div>
  );
}

function ControlButton({
  onClick: onClick,
  children: children,
}: {
  onClick?: () => void;
  children: React.ReactNode | React.ReactNode[] | string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      {children}
    </button>
  );
}
