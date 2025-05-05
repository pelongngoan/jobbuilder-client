import React, { useState } from "react";
import {
  X,
  Upload,
  Download,
  File,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { JobPost } from "./JobCard";
import { processJobPostCSVImport } from "./csv-helpers";

interface ImportCSVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (jobPosts: Partial<JobPost>[], file: File) => void;
}

export const ImportCSVDialog: React.FC<ImportCSVDialogProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Partial<JobPost>[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
  };

  const handleFileProcessing = async (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setFile(file);
    setParsing(true);

    // Read the file content
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvData = e.target?.result as string;
        const jobPosts = await processJobPostCSVImport(csvData);

        setPreviewData(jobPosts);
        setParsing(false);
      } catch (err) {
        console.error("Error parsing CSV:", err);
        setError("Error parsing CSV. Please check the file format.");
        setParsing(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
      setParsing(false);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (file) {
      onImportComplete(previewData, file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Dialog panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Import Job Posts from CSV
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  {!file ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        isDragOver
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop your CSV file here, or
                      </p>
                      <label className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        Browse Files
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  ) : parsing ? (
                    <div className="text-center py-8">
                      <div className="flex justify-center items-center mb-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Parsing CSV file...
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4 text-gray-700">
                        <File className="h-5 w-5 mr-2" />
                        <span className="font-medium">{file.name}</span>
                      </div>

                      {error ? (
                        <div className="bg-red-50 p-4 rounded-md mb-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-700">{error}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 p-4 rounded-md mb-4">
                          <div className="flex">
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                            <span className="text-green-700">
                              Successfully parsed {previewData.length} job posts
                            </span>
                          </div>
                        </div>
                      )}

                      {previewData.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Preview:</h4>
                          <div className="max-h-60 overflow-y-auto border rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.slice(0, 5).map((job, index) => (
                                  <tr key={index}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      {job.title}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      {job.companyName}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      {job.location}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      {job.status}
                                    </td>
                                  </tr>
                                ))}
                                {previewData.length > 5 && (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="px-3 py-2 text-sm text-gray-500 text-center"
                                    >
                                      + {previewData.length - 5} more job posts
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!file ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={parsing || previewData.length === 0 || !!error}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    (parsing || previewData.length === 0 || !!error) &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Import {previewData.length} Job Posts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                    setPreviewData([]);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Try Another File
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
