import AnimateModeToggle from "./animate-mode-toggle";
import AnimationDelayInput from "./animation-delay-input";
import DirectionModeToggle from "./direction-mode-toggle";
import EraseBtn from "./erase-btn";
import LabelModeToggle from "./label-mode-toggle";
import SnapshotControls from "./snapshot-controls";

export default function Toolbar() {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <SnapshotControls />
      </div>
      <div>
        <EraseBtn />
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
      <div>
        <AnimationDelayInput />
      </div>
    </div>
  );
}
