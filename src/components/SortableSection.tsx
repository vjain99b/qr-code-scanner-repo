import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image, Type, FileText, Layout } from 'lucide-react';

interface Section {
  id: string;
  type: 'logo' | 'image' | 'description' | 'footer';
  content: string;
}

interface Props {
  section: Section;
  onChange: (content: string) => void;
}

export default function SortableSection({ section, onChange }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const icons = {
    logo: Layout,
    image: Image,
    description: Type,
    footer: FileText,
  };

  const Icon = icons[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-lg p-4"
    >
      <div className="flex items-start gap-4">
        <button
          className="mt-1 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-indigo-600" />
            <h3 className="font-medium text-gray-900 capitalize">
              {section.type}
            </h3>
          </div>

          {(section.type === 'logo' || section.type === 'image') && (
            <input
              type="url"
              value={section.content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={`Enter ${section.type} URL`}
            />
          )}

          {section.type === 'description' && (
            <textarea
              value={section.content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Enter product description"
            />
          )}

          {section.type === 'footer' && (
            <input
              type="text"
              value={section.content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter footer text"
            />
          )}
        </div>
      </div>
    </div>
  );
}