import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ToolForm from './DocForm/DocForm';
import { ToolRegistry } from './configs/ToolRegistry';

const DocGenTool = () => {
  const { toolId } = useParams();
  const config = ToolRegistry[toolId];

  if (!config) {
    return (
      <div className="p-10 text-center">
        <h2>Tool Not Found</h2>
        <p>The document tool "{toolId}" does not exist.</p>
        <Link to="/tools" className="text-blue-600 underline">Return to Tools</Link>
      </div>
    );
  }

  return <ToolForm toolConfig={config} />;
};

export default DocGenTool;