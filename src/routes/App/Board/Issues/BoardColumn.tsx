import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import AddLineIcon from "remixicon-react/AddLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import More2FillIcon from "remixicon-react/More2FillIcon";
import Button from "../../../../components/Button";
import FormInputError from "../../../../components/FormInputError";
import TextArea from "../../../../components/TextArea";
import { BoardColumn as BoardColumnType } from "../../../../types/Board";
import BoardCard, { BoardCardProps } from "./BoardCard";
import BoardColumnOptionDropdown from "./BoardColumnOptionDropdown";
import useRoleContext from "../../../../hooks/useRoleContext";
export interface CreateCardArgs {
  boardColumnId: number;
  summary: string;
}
export interface BoardColumnProps {
  column: BoardColumnType;
  onCreateCard: (card: CreateCardArgs) => void;
  onClickCard: BoardCardProps["onClick"];
  onRemoveColumn: (column: BoardColumnType) => void;
}

const BoardColumn = ({
  column,
  onCreateCard,
  onClickCard,
  onRemoveColumn,
}: BoardColumnProps) => {
  const [isAddingCard, setAddingCard] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [optionBtn, setOptionBtn] = useState<HTMLElement>();
  const { role } = useRoleContext();

  const handleCancelAddCard = () => {
    setAddingCard(false);
    setSummary("");
    setError("");
  };

  const handleSubmitAddCard = () => {
    if (!summary) {
      setError("Please enter card summary.");
      return;
    }
    setError("");
    setAddingCard(false);
    setSummary("");
    onCreateCard({ boardColumnId: column.id, summary: summary });
  };

  function handleDeleteColumn() {
    setOptionBtn(undefined);
    onRemoveColumn(column);
  }

  const addCardForm = (
    <div className="mt-2">
      <TextArea
        rows={5}
        placeholder="Summary"
        onChange={(e) => {
          setSummary(e.currentTarget.value);
          setError("");
        }}
        value={summary}
        $hasError={error !== ""}
      />
      {error !== "" && <FormInputError>{error}</FormInputError>}
      <div className="flex mt-2 gap-2">
        <Button
          onClick={handleSubmitAddCard}
          $variant="primary"
          className="flex-grow"
        >
          Add card
        </Button>
        <Button onClick={handleCancelAddCard} $variant="ghost" $shape="square">
          <CloseLineIcon size={20} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex-none rounded-lg bg-gray-100 w-80 p-3 transition-all">
      <div className="flex items-center">
        <div className="break-all px-2 text-sm text-[#44546f] font-semibold">
          {column.name}
        </div>
        <div className="flex-1"></div>
        <Button
          onClick={(e) => setOptionBtn(e.currentTarget)}
          $variant="ghost"
          $shape="square"
          className="self-start"
        >
          <More2FillIcon size={16} />
        </Button>
        {optionBtn && (
          <BoardColumnOptionDropdown
            anchor={optionBtn}
            onCloseDropdown={() => setOptionBtn(undefined)}
            onDeleteColumn={handleDeleteColumn}
          />
        )}
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 mt-2"
          >
            {column?.BoardColumnCards.map((boardCard, i) => (
              <BoardCard
                onClick={onClickCard}
                key={boardCard.id}
                indexInColumn={i}
                boardCard={boardCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {role !== "OBSERVER" && (
        <>
          {isAddingCard ? (
            addCardForm
          ) : (
            <div className="mt-2">
              <Button
                onClick={() => setAddingCard(true)}
                $variant="ghost"
                $shape="rect"
                className="w-full flex items-center text-sm"
              >
                <AddLineIcon className="mr-2" size={20}></AddLineIcon>{" "}
                <span className="text-[#44546f] font-semibold">Add a card</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoardColumn;
