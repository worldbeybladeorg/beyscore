export interface EarnPointArgs {
  Points: number;
  Player: number;
  Reason: string;
}

interface WinButtonProps {
  winName: string;
  isDisabled: boolean;
  clickFunc: (args: EarnPointArgs) => void;
  args: EarnPointArgs;
}

export default function WinButton({
  winName,
  isDisabled,
  clickFunc,
  args,
}: WinButtonProps) {
  return (
    <button
      className="btn btn-success"
      disabled={isDisabled}
      onClick={() => clickFunc(args)}
    >
      {winName}
    </button>
  );
}
