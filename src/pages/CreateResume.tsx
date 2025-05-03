import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FileText, Check, X, Star, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Navigation } from "../components/Navigation";

type TemplateCategory =
  | "all"
  | "professional"
  | "creative"
  | "minimal"
  | "modern";

interface ResumeTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnail: string;
  description: string;
  popularity: number;
  isNew?: boolean;
}

export const CreateResume = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<TemplateCategory>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for resume templates
  const templates: ResumeTemplate[] = [
    {
      id: "template-1",
      name: "Professional Classic",
      category: "professional",
      thumbnail:
        "https://placehold.co/300x400/2563eb/ffffff?text=Professional+Classic",
      description:
        "A clean and traditional resume template perfect for corporate positions.",
      popularity: 98,
    },
    {
      id: "template-2",
      name: "Creative Portfolio",
      category: "creative",
      thumbnail:
        "https://placehold.co/300x400/7c3aed/ffffff?text=Creative+Portfolio",
      description:
        "Showcase your work with this visually appealing template for creative professionals.",
      popularity: 85,
    },
    {
      id: "template-3",
      name: "Minimal Elegance",
      category: "minimal",
      thumbnail:
        "https://placehold.co/300x400/64748b/ffffff?text=Minimal+Elegance",
      description:
        "Simple yet sophisticated design that puts focus on your content.",
      popularity: 92,
    },
    {
      id: "template-4",
      name: "Modern Tech",
      category: "modern",
      thumbnail: "https://placehold.co/300x400/0ea5e9/ffffff?text=Modern+Tech",
      description:
        "Contemporary design with a tech-focused layout for IT and software professionals.",
      popularity: 95,
      isNew: true,
    },
    {
      id: "template-5",
      name: "Executive Summary",
      category: "professional",
      thumbnail:
        "https://placehold.co/300x400/2563eb/ffffff?text=Executive+Summary",
      description:
        "Elegant template designed for senior professionals and executives.",
      popularity: 88,
    },
    {
      id: "template-6",
      name: "Creative Artist",
      category: "creative",
      thumbnail:
        "https://placehold.co/300x400/7c3aed/ffffff?text=Creative+Artist",
      description:
        "Bold and artistic design for creative professionals in the arts.",
      popularity: 76,
    },
    {
      id: "template-7",
      name: "Minimalist",
      category: "minimal",
      thumbnail: "https://placehold.co/300x400/64748b/ffffff?text=Minimalist",
      description:
        "Ultra-clean design with plenty of white space for easy reading.",
      popularity: 82,
    },
    {
      id: "template-8",
      name: "Modern Startup",
      category: "modern",
      thumbnail:
        "https://placehold.co/300x400/0ea5e9/ffffff?text=Modern+Startup",
      description:
        "Fresh and innovative design perfect for startup environments.",
      popularity: 90,
      isNew: true,
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateResume = () => {
    if (selectedTemplate) {
      // Navigate to the resume editor with the selected template
      navigate(`/resume-editor/${selectedTemplate}`);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderTemplateGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredTemplates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => handleTemplateSelect(template.id)}
        >
          <div className="relative">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {template.isNew && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                New
              </div>
            )}
            {selectedTemplate === template.id && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <Check className="h-6 w-6" />
                </div>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900">{template.name}</h3>
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs ml-1">{template.popularity}%</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              {template.description}
            </p>
            <div className="flex items-center text-xs text-slate-500">
              <span className="capitalize">{template.category}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>5 min to complete</span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPreview = () => {
    const template = templates.find((t) => t.id === selectedTemplate);

    if (!template) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-slate-900">
              Preview: {template.name}
            </h2>
            <button
              onClick={handleClosePreview}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-[800px] mx-auto bg-white shadow-lg">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="p-4 border-t flex justify-between">
            <Button variant="outline" onClick={handleClosePreview}>
              Back to Templates
            </Button>
            <Button
              onClick={() => {
                // Navigate to the resume editor
                navigate(`/resume-editor/${template.id}`);
              }}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Use This Template
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Create a New Resume
              </h1>
              <p className="text-slate-600 mt-2">
                Choose a template that best represents your professional style
                and experience.
              </p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Input
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search templates..."
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Templates
                </Button>
                <Button
                  variant={
                    selectedCategory === "professional" ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory("professional")}
                >
                  Professional
                </Button>
                <Button
                  variant={
                    selectedCategory === "creative" ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory("creative")}
                >
                  Creative
                </Button>
                <Button
                  variant={
                    selectedCategory === "minimal" ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory("minimal")}
                >
                  Minimal
                </Button>
                <Button
                  variant={
                    selectedCategory === "modern" ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory("modern")}
                >
                  Modern
                </Button>
              </div>
            </div>

            {filteredTemplates.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No templates found
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search or filter criteria to find the
                    perfect template.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              renderTemplateGrid()
            )}

            {selectedTemplate && (
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={handleCreateResume}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create Resume with Selected Template
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPreview && renderPreview()}
    </>
  );
};
