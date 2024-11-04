import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useForm } from 'react-hook-form';
import { Image, Type, FileText, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import SortableSection from '../components/SortableSection';

interface Section {
  id: string;
  type: 'logo' | 'image' | 'description' | 'footer';
  content: string;
}

interface FormData {
  name: string;
}

export default function GenerateQR() {
  const [sections, setSections] = useState<Section[]>([
    { id: '1', type: 'logo', content: '' },
    { id: '2', type: 'image', content: '' },
    { id: '3', type: 'description', content: '' },
    { id: '4', type: 'footer', content: '' },
  ]);
  const [uniqueCode] = useState(uuidv4().slice(0, 8));
  const { register, handleSubmit } = useForm<FormData>();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateSectionContent = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, content } : section
      )
    );
  };

  const handleCreate = async (formData: FormData) => {
    try {
      const pageData = {
        name: formData.name,
        sections: sections,
        createdAt: new Date(),
        scans: 0,
      };

      await setDoc(doc(db, 'qrCodes', uniqueCode), pageData);
      toast.success('QR code created successfully!');
    } catch (error) {
      toast.error('Failed to create QR code');
    }
  };

  const previewUrl = `${window.location.origin}/preview/${uniqueCode}`;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate QR Code</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter a name for your QR page"
                />
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Page Sections
            </h2>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onChange={(content) =>
                        updateSectionContent(section.id, content)
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit(handleCreate)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create QR Code
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Preview</h2>
            <div className="aspect-[9/16] bg-gray-50 rounded-lg overflow-y-auto p-4">
              <div className="max-w-md mx-auto">
                {sections.map((section) => (
                  <div key={section.id} className="mb-6">
                    {section.type === 'logo' && section.content && (
                      <div className="flex justify-center">
                        <img
                          src={section.content}
                          alt="Logo"
                          className="h-16 object-contain"
                        />
                      </div>
                    )}
                    {section.type === 'image' && section.content && (
                      <img
                        src={section.content}
                        alt="Product"
                        className="w-full rounded-lg shadow-md"
                      />
                    )}
                    {section.type === 'description' && section.content && (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}
                    {section.type === 'footer' && section.content && (
                      <div className="text-sm text-gray-500 border-t pt-4">
                        {section.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">QR Code</h2>
            <div className="flex justify-center mb-4">
              <QRCodeCanvas value={previewUrl} size={200} />
            </div>
            <div className="text-sm text-gray-500">
              Unique Code: <span className="font-mono">{uniqueCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
