import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "../../components/common";
import useApiCall from "../../hooks/useApiCall";
import skillService from "../../services/skillService";
import { Skill, SkillCategory } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ManageSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filterCategory, setFilterCategory] = useState<SkillCategory | "all">(
    "all"
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "Technical" as SkillCategory,
    description: "",
  });

  const getSkillsApi = useApiCall("getSkills");
  const createSkillApi = useApiCall("createSkill");
  const updateSkillApi = useApiCall("updateSkill");
  const deleteSkillApi = useApiCall("deleteSkill");

  const loading = useSelector(
    (state: RootState) =>
      state.loading["getSkills"] ||
      state.loading["createSkill"] ||
      state.loading["updateSkill"] ||
      state.loading["deleteSkill"]
  );

  const fetchSkills = async () => {
    await getSkillsApi.execute(async () => {
      try {
        const response = await skillService.getSkills();
        if (response.success && response.data) {
          setSkills(response.data);
        }
        return response;
      } catch (error) {
        console.error("Error fetching skills:", error);
        throw error;
      }
    });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filteredSkills = skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSkills(filteredSkills);
    } else {
      fetchSkills();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    await createSkillApi.execute(async () => {
      try {
        const response = await skillService.createSkill({
          name: formData.name,
          category: formData.category,
          description: formData.description,
        });

        if (response.success) {
          setFormData({
            name: "",
            category: "Technical" as SkillCategory,
            description: "",
          });
          setShowAddForm(false);
          fetchSkills();
        }

        return response;
      } catch (error) {
        console.error("Error creating skill:", error);
        throw error;
      }
    });
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category as SkillCategory,
      description: skill.description || "",
    });
    setShowAddForm(true);
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSkill || !formData.name.trim()) return;

    await updateSkillApi.execute(async () => {
      try {
        const response = await skillService.updateSkill(selectedSkill._id, {
          name: formData.name,
          category: formData.category,
          description: formData.description,
        });

        if (response.success) {
          setFormData({
            name: "",
            category: "Technical" as SkillCategory,
            description: "",
          });
          setSelectedSkill(null);
          setShowAddForm(false);
          fetchSkills();
        }

        return response;
      } catch (error) {
        console.error("Error updating skill:", error);
        throw error;
      }
    });
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await deleteSkillApi.execute(async () => {
        try {
          const response = await skillService.deleteSkill(skillId);

          if (response.success) {
            fetchSkills();
          }

          return response;
        } catch (error) {
          console.error("Error deleting skill:", error);
          throw error;
        }
      });
    }
  };

  const handleCancelForm = () => {
    setFormData({
      name: "",
      category: "Technical" as SkillCategory,
      description: "",
    });
    setSelectedSkill(null);
    setShowAddForm(false);
  };

  const filteredSkills = skills.filter((skill) => {
    if (filterCategory !== "all") {
      return skill.category === filterCategory;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Skills</h1>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Skill
        </Button>
      </div>

      {/* Add/Edit Skill Form */}
      {showAddForm && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3">
            {selectedSkill ? "Edit Skill" : "Add New Skill"}
          </h2>
          <form onSubmit={selectedSkill ? handleUpdateSkill : handleAddSkill}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter skill name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Technical">Technical</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools">Tools</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter skill description"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelForm}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading
                  ? selectedSkill
                    ? "Updating..."
                    : "Adding..."
                  : selectedSkill
                  ? "Update Skill"
                  : "Add Skill"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
          <form onSubmit={handleSearch} className="flex gap-4 flex-grow">
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

          <div className="flex-shrink-0">
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as SkillCategory | "all")
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Languages">Languages</option>
              <option value="Tools">Tools</option>
              <option value="Frameworks">Frameworks</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && !showAddForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading skills...</p>
        </div>
      )}

      {/* Error state */}
      {getSkillsApi.error && (
        <div className="bg-red-100 p-4 rounded-md mb-6">
          <p className="text-red-700">Error: {getSkillsApi.error}</p>
        </div>
      )}

      {/* Skills list */}
      {!loading && (
        <>
          {!filteredSkills || filteredSkills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No skills found. Add a new skill to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <Card key={skill._id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{skill.name}</h2>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                        {skill.category}
                      </span>
                      {skill.description && (
                        <p className="text-gray-600 mt-2 text-sm">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSkill(skill)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeleteSkill(skill._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageSkills;
