import AnimateModeToggle from "./animate-mode-toggle";
import AnimationDelayInput from "./animation-delay-input";
import DirectionModeToggle from "./direction-mode-toggle";
import LabelModeToggle from "./label-mode-toggle";

export default function Toolbar() {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <AnimationDelayInput />
      </div>
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
