import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { PenSquare } from 'lucide-react';
import { TSPage, TSListItem } from '../../components/TSPage/TSPage';
import { ToolRegistry } from './Tools/DocGenTool/configs/ToolRegistry';

const ToolsPage = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setSearchQuery('');
    };
  }, [setSearchQuery]);

  const toolsList = useMemo(() => {
    return Object.values(ToolRegistry).map((config) => ({
      id: config.id,
      name: config.title,
      skills: [config.subtitle], 
      status: 'Active',
      path: `/tools/${config.id}`, 
      icon: PenSquare,
      category: 'Document Drafting',
    }));
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return toolsList;
    const query = searchQuery.toLowerCase();
    return toolsList.filter(tool => {
      return tool.name.toLowerCase().includes(query) || 
             tool.skills.some(skill => skill.toLowerCase().includes(query));
    });
  }, [searchQuery, toolsList]);

  const handleUseTool = (tool) => {
    if (tool.status === 'Active' && tool.path) {
      navigate(tool.path);
    }
  };

  return (
    <TSPage 
      title="Legal Tools" 
      subtitle="Powerful AI-driven tools for your legal needs"
    >
      {filteredTools.length > 0 ? (
        filteredTools.map(tool => (
          <TSListItem
            key={tool.id}
            name={tool.name}
            skills={tool.skills}
            icon={tool.icon}
            onClick={() => handleUseTool(tool)}
          />
        ))
      ) : (
        <div className="ts-empty-state">
          No tools found matching your criteria.
        </div>
      )}
    </TSPage>
  );
};

export default ToolsPage;