import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react'; // Using Lucide icon for the magic wand

interface Field {
  name: string;
  selected: boolean;
  value: string;
}

interface AIWizardProps {
  formType: string;
  formData: any;
  formRef: React.RefObject<HTMLFormElement>;
  onClose: () => void;
  isOpen: boolean;
  onOpen: () => void;
}

export const AIWizard: React.FC<AIWizardProps> = ({
  formType,
  formData,
  formRef,
  onClose,
  isOpen,
  onOpen
}) => {
  const [fields, setFields] = useState<Field[]>([]);

  // Define available fields for each form type
  const fieldDefinitions = {
    chapter: ['title', 'sequence', 'summary', 'description', 'status'],
    scene: ['name', 'content', 'summary', 'sequence', 'description', 'scene_beats', 'status']
  };

  useEffect(() => {
    console.log('AIWizard: Form type changed to:', formType);
    console.log('AIWizard: Form data:', formData);
    console.log('AIWizard: Form ref current:', formRef.current);

    if (formRef.current) {
      const formFields = new FormData(formRef.current);
      console.log('AIWizard: FormData entries:', Array.from(formFields.entries()));
      
      const availableFields = fieldDefinitions[formType as keyof typeof fieldDefinitions] || [];
      console.log('AIWizard: Available fields for type:', availableFields);
      
      const newFields = availableFields.map(fieldName => {
        const fieldValue = formFields.get(fieldName)?.toString() || '';
        console.log(`AIWizard: Field ${fieldName} value:`, fieldValue);
        
        return {
          name: fieldName,
          selected: true,
          value: fieldValue
        };
      });
      
      console.log('AIWizard: Setting fields to:', newFields);
      setFields(newFields);
    } else {
      console.log('AIWizard: Form ref is null');
    }
  }, [formType, formRef.current]);

  // Function to toggle field selection
  const toggleField = (fieldName: string) => {
    console.log('AIWizard: Toggling field:', fieldName);
    setFields(prev => prev.map(field => 
      field.name === fieldName 
        ? { ...field, selected: !field.selected }
        : field
    ));
  };

  // Function to generate prompt based on selected fields
  const generatePrompt = () => {
    const selectedFields = fields.filter(f => f.selected);
    
    let prompt = `Help me write content for a ${formType}.\n\n`;
    prompt += `Current fields:\n`;
    
    selectedFields.forEach(field => {
      if (field.value) {
        prompt += `${field.name}: ${field.value}\n`;
      }
    });
    
    return prompt;
  };

  // Function to apply AI suggestions to form
  const applyAISuggestions = (suggestions: any) => {
    if (!formRef.current) return;
    
    Object.entries(suggestions).forEach(([field, value]) => {
      const element = formRef.current?.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
      if (element) {
        element.value = value as string;
        // Trigger change event to update React state
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed right-4 top-20 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
        title="AI Writing Assistant"
      >
        <Wand2 className="h-6 w-6 text-blue-500" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg p-4 overflow-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AI Writing Assistant</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Current Form</h3>
          <p className="capitalize">{formType}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Available Fields</h3>
          <div className="space-y-2">
            {fields.map(field => (
              <label 
                key={field.name} 
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={field.selected}
                  onChange={() => toggleField(field.name)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="capitalize">{field.name.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => {
            const prompt = generatePrompt();
            console.log('Generated prompt:', prompt);
          }}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Suggestions
        </button>
      </div>
    </div>
  );
}; 