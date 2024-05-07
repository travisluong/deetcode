import AnimateModeToggle from "./animate-mode-toggle";
import DirectionModeToggle from "./direction-mode-toggle";
import LabelModeToggle from "./label-mode-toggle";

export default function Toolbar() {
  return (
    <div className="flex gap-2">
      <div>
        <LabelModeToggle />
      </div>
      <div>
        <AnimateModeToggle />
      </div>
      <div>
        <DirectionModeToggle />
      </div>
    </div>
  );
}
