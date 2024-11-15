import { Loader } from 'lucide-react';

const LoadingState = () => (
  <div className="bg-white rounded-lg shadow-sm p-12 mb-8 text-center">
    <Loader className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
    <h2 className="text-2xl font-semibold mb-2">Generating Your Presentation</h2>
    <p className="text-gray-600">This may take a few moments...</p>
  </div>
);

export default LoadingState;