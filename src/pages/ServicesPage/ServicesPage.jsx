import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { BookOpen, FileText, Briefcase, Scale } from 'lucide-react'; 
import { TSPage, TSListItem } from '../../components/TSPage/TSPage';

const legalServices = [
  {
    id: 0,
    name: 'LegalMate AI',
    skills: ['Instant Answers', 'Legal Information'],
    status: 'Active',
    path: '/legalmate-ai',
    icon: Scale,
    category: 'AI Solutions',
  },
  {
    id: 1,
    name: 'Legal Research',
    skills: ['Case Law Search', 'Statutes & Acts'],
    status: 'Active',
    path: '/legal-research',
    icon: BookOpen,
    category: 'AI Solutions',
  },
  {
    id: 2,
    name: 'Doc Analyzer',
    skills: ['Clause Extraction', 'Risk Assessment'],
    status: 'Active',
    path: '/doc-analyzer',
    icon: FileText,
    category: 'AI Solutions',
  },
  {
    id: 3,
    name: 'Case Management System',
    skills: ['Workflow Automation', 'Deadline Tracking'],
    status: 'Active',
    path: '/case-management',
    icon: Briefcase,
    category: 'Managed Services',
  },
];

const ServicesPage = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setSearchQuery('');
    };
  }, [setSearchQuery]);

  const filteredServices = useMemo(() => {
    if (!searchQuery) return legalServices;
    const query = searchQuery.toLowerCase();
    return legalServices.filter(service => 
      service.name.toLowerCase().includes(query) || 
      service.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleUseService = (service) => {
    const destinationPath = (service.id === 0 || service.id === 1) 
      ? `${service.path}?new=true` 
      : service.path;
      
    navigate(destinationPath);
  };

  return (
    <TSPage 
      title="Our Services" 
      subtitle="Expert services for your legal practice"
    >
      {filteredServices.length > 0 ? (
        filteredServices.map(service => (
          <TSListItem
            key={service.id}
            name={service.name}
            skills={service.skills}
            icon={service.icon}
            onClick={() => handleUseService(service)}
          />
        ))
      ) : (
        <div className="ts-empty-state">
          No services found matching your criteria.
        </div>
      )}
    </TSPage>
  );
};

export default ServicesPage;