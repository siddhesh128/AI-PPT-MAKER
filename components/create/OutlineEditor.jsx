'use client'
import { Edit2, Send } from 'lucide-react';
import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

const OutlineEditor = ({ outline, onOutlineChange, onBack, onGenerate }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [outline]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Presentation Outline</h2>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presentation Title
          </label>
          <input
            type="text"
            value={outline.title}
            onChange={(e) => onOutlineChange({...outline, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        {/* Sections */}
        {outline.sections.map((section, sIndex) => (
          <div key={sIndex} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const newSections = [...outline.sections];
                  newSections[sIndex] = { ...section, title: e.target.value };
                  onOutlineChange({...outline, sections: newSections});
                }}
                className="text-lg font-medium px-2 py-1 border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 w-full"
              />
              <button className="text-gray-400 hover:text-gray-600 ml-2">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-4">
              {section.points.map((point, pIndex) => (
                <li key={pIndex} className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={point.main}
                    onChange={(e) => {
                      const newSections = [...outline.sections];
                      newSections[sIndex].points[pIndex] = {
                        ...point,
                        main: e.target.value
                      };
                      onOutlineChange({...outline, sections: newSections});
                    }}
                    className="flex-1 px-2 py-1 border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 font-medium"
                  />
                  <textarea
                    value={point.description}
                    onChange={(e) => {
                      const newSections = [...outline.sections];
                      newSections[sIndex].points[pIndex] = {
                        ...point,
                        description: e.target.value
                      };
                      onOutlineChange({...outline, sections: newSections});
                    }}
                    className="flex-1 px-2 py-1 border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 text-sm"
                    rows={2}
                    placeholder="Description..."
                  />
                  {/* Add code editor if point has code */}
                  {point.code && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code Sample ({point.language || 'javascript'})
                      </label>
                      <div className="relative">
                        <textarea
                          value={point.code}
                          onChange={(e) => {
                            const newSections = [...outline.sections];
                            newSections[sIndex].points[pIndex] = {
                              ...point,
                              code: e.target.value
                            };
                            onOutlineChange({...outline, sections: newSections});
                          }}
                          className="w-full px-4 py-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg"
                          rows={5}
                        />
                        <pre className="absolute top-0 left-0 pointer-events-none">
                          <code className={`language-${point.language || 'javascript'}`}>
                            {point.code}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Back to Input
          </button>
          <button
            onClick={onGenerate}
            className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Generate Presentation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutlineEditor;