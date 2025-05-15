import React, { useEffect, useState } from "react";
import { Button, Card, Input, Select, TextArea } from "../../components/common";
import useApiCall from "../../hooks/useApiCall";
import resumeService from "../../services/resumeService";
import { Resume, ResumeTemplate } from "../../types";

const ResumeBuilderPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const getResumesApi = useApiCall("getResumes");
  const getTemplatesApi = useApiCall("getResumeTemplates");
  const createResumeApi = useApiCall("createResume");
  const deleteResumeApi = useApiCall("deleteResume");

  useEffect(() => {
    const fetchResumesAndTemplates = async () => {
      // Fetch user's resumes
      await getResumesApi.execute(async () => {
        const response = await resumeService.getMyResumes();
        if (response.success && response.data) {
          setResumes(response.data);
          if (response.data.length > 0 && !activeResumeId) {
            setActiveResumeId(response.data[0]._id);
          }
        }
        return response;
      });

      // Fetch available resume templates
      await getTemplatesApi.execute(async () => {
        const response = await resumeService.getResumeTemplates();
        if (response.success && response.data) {
          setTemplates(response.data);
          if (response.data.length > 0 && !selectedTemplate) {
            setSelectedTemplate(response.data[0]._id);
          }
        }
        return response;
      });
    };

    fetchResumesAndTemplates();
  }, [getResumesApi, getTemplatesApi, activeResumeId, selectedTemplate]);

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();

    await createResumeApi.execute(async () => {
      const response = await resumeService.createResume({
        name: resumeName,
        templateId: selectedTemplate,
      });

      if (response.success && response.data) {
        setResumes([...resumes, response.data]);
        setActiveResumeId(response.data._id);
        setShowCreateForm(false);
        setResumeName("");
      }

      return response;
    });
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      await deleteResumeApi.execute(async () => {
        const response = await resumeService.deleteResume(resumeId);

        if (response.success) {
          setResumes(resumes.filter((resume) => resume._id !== resumeId));
          if (activeResumeId === resumeId) {
            setActiveResumeId(resumes.length > 1 ? resumes[0]._id : null);
          }
        }

        return response;
      });
    }
  };

  const activeResume = resumes.find((resume) => resume._id === activeResumeId);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          Create New Resume
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-4">Create New Resume</h2>
          <form onSubmit={handleCreateResume}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Resume Name"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="e.g., Software Engineer Resume"
                  required
                />
              </div>
              <div>
                <Select
                  label="Template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="text"
                onClick={() => setShowCreateForm(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={createResumeApi.loading}
              >
                {createResumeApi.loading ? "Creating..." : "Create Resume"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {getResumesApi.loading ? (
        <p className="text-gray-500">Loading your resumes...</p>
      ) : resumes.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">
            You haven't created any resumes yet.
          </p>
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            Create Your First Resume
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold mb-3">My Resumes</h2>
            <div className="space-y-2">
              {resumes.map((resume) => (
                <Card
                  key={resume._id}
                  className={`p-3 cursor-pointer transition ${
                    activeResumeId === resume._id
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setActiveResumeId(resume._id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{resume.name}</h3>
                    <div className="flex space-x-1">
                      <Button
                        variant="text"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `/api/resumes/${resume._id}/download`,
                            "_blank"
                          );
                        }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="text"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResume(resume._id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated:{" "}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {activeResume ? (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Edit: {activeResume.name}
                </h2>
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Preview</h3>
                    <div className="aspect-w-8.5 aspect-h-11 bg-white border border-gray-200 p-4">
                      {/* This would be replaced with an actual resume preview component */}
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Resume Preview</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mb-4">
                    <Button variant="outline">Edit Sections</Button>
                    <Button variant="primary">Download PDF</Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-6 flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Select a resume to edit or create a new one
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;
