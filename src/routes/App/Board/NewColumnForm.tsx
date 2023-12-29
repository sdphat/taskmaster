import React, { FormEvent, useState } from "react";
import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button";
import CloseLineIcon from "remixicon-react/CloseLineIcon";

export interface NewColumnFormProps {
  onAddColumn: (columnName: string) => Promise<void> | void;
}

const NewColumnForm = ({ onAddColumn }: NewColumnFormProps) => {
  const [columnName, setColumnName] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (columnName) {
      await onAddColumn(columnName);
      setColumnName("");
      setFormOpen(false);
    }
  };

  return (
    <div className="flex-none w-80">
      {formOpen ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md p-2 shadow"
        >
          <FormInput
            placeholder="Enter list title..."
            onChange={(e) => setColumnName(e.target.value)}
          />
          <div className="flex mt-3 gap-2">
            <Button $variant="primary" className="flex-grow">
              Add a list
            </Button>
            <Button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setColumnName("");
              }}
              $variant="ghost"
              $shape="square"
            >
              <CloseLineIcon size={20} />
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setFormOpen(true)}
          className="grid place-items-center 
        font-medium text-gray-400
        rounded-md border-dashed border-2 border-gray-300 w-80 h-24 bg-gray-50 
        hover:text-gray-500 hover:bg-gray-100 transition-all"
        >
          Add new list
        </button>
      )}
    </div>
  );
};

export default NewColumnForm;
