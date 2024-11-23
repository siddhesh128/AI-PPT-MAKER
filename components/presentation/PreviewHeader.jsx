
import React from 'react';
import { Download, Palette } from 'lucide-react';
import { X as XIcon } from 'lucide-react';
import { themeOptions } from '../../themes/presentationThemes';

export function PreviewHeader({ currentTheme, setCurrentTheme, onDownload, onClose }) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900">Preview Presentation</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <Palette className="w-4 h-4 text-gray-700" />
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900"
          >
            {themeOptions.map(theme => (
              <option key={theme.value} value={theme.value} className="bg-white text-gray-900">
                {theme.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button onClick={onClose}>
          <XIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}