import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
interface ImportCsvProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  onDownloadTemplate: () => void;
  title: string;
}
export const ImportCsv = ({
  isOpen,
  onClose,
  onSubmit = () => {},
  onDownloadTemplate = () => {},
  title,
}: ImportCsvProps) => {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Import ${title} from CSV`}
        size="md"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-400  hover:bg-gray-500 rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={() => file && onSubmit(file)}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Import
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <Button onClick={onDownloadTemplate}>Download Template</Button>

          <input
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            type="file"
            id="csvFileInput"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
      </Modal>
    </>
  );
};
