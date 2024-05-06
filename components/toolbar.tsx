import AnimateModeToggle from "./animate-mode-toggle";
import DirectionModeToggle from "./direction-mode-toggle";

export default function Toolbar() {
  return (
    <div className="flex gap-2">
      <div>
        <AnimateModeToggle />
      </div>
      <div>
        <DirectionModeToggle />
      </div>
    </div>
  );
}
