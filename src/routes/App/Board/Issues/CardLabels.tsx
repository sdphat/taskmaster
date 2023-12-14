import { BoardColumnCard } from "../../../../types/Board";
import { getTextColor } from "../../../../utils/labelUtils";
import { Line } from "./CardDetailModal";

export interface CardLabelsProps {
  labels: BoardColumnCard["Labels"];
}

// Todo: Open card label dialog to add label
const CardLabels = ({ labels }: CardLabelsProps) => {
  return (
    <Line>
      <div>
        <h3>Labels</h3>
        <div className="mt-1 flex gap-1 flex-wrap">
          {labels.map((label) => (
            <span
              style={{
                backgroundColor: label.color,
                color: getTextColor(label.color)?.textColor,
              }}
              className="min-w-[2rem] py-2 px-4 rounded-md text-center font-semibold"
              key={label.id}
            >
              {label.name}
            </span>
          ))}
        </div>
      </div>
    </Line>
  );
};

export default CardLabels;
