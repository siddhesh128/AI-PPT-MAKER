'use client'
import { Layout, Loader } from 'lucide-react';
import { styleOptions } from '../../styles/constants';
import { useEffect, useState } from 'react';

const InputForm = ({ topic, slides, style, isGenerating, onTopicChange, onSlidesChange, onStyleChange, onGenerate, template, onTemplateChange }) => {
  const [templates, setTemplates] = useState([]);
  const [templateError, setTemplateError] = useState(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const response = await fetch('/api/generate-presentation');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        console.log('Fetched templates:', data.templates); // Debug log
        setTemplates(data.templates || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setTemplateError(error.message);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="space-y-6">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presentation Topic or Description
          </label>
          <textarea
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={4}
            placeholder="Enter your presentation topic or describe what you want to create..."
          />
        </div>

        {/* Number of Slides */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Slides
          </label>
          <input
            type="number"
            value={slides}
            onChange={(e) => onSlidesChange(e.target.value)}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            min="1"
            max="50"
          />
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presentation Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {styleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStyleChange(option.value)}
                className={`px-4 py-2 rounded-lg border ${
                  style === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presentation Theme
          </label>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-transparent"
          >
            <option value="modern">Modern</option>
            <option value="tech">Tech</option>
            <option value="nature">Nature</option>
          </select>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presentation Template
          </label>
          {isLoadingTemplates ? (
            <div className="text-sm text-gray-500">Loading templates...</div>
          ) : templateError ? (
            <div className="text-sm text-red-500">{templateError}</div>
          ) : (
            <select
              value={template}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-transparent"
            >
              <option value="" className="text-gray-900">Default Template</option>
              {templates.map((tmpl) => (
                <option key={tmpl} value={tmpl} className="text-gray-900">
                  {tmpl}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!topic || isGenerating}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 
            ${!topic || isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating Outline...</span>
            </>
          ) : (
            <>
              <Layout className="w-5 h-5" />
              <span>Generate Outline</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;