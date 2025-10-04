"use client";

import React from 'react';
import { Button } from '../components/ui/button';

interface DataManagementProps {
  onBack?: () => void;
}

export function DataManagement({ onBack }: DataManagementProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl">Data Management (stub)</h2>
          <div>
            <Button variant="ghost" onClick={onBack}>Back</Button>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600">This is a placeholder for the Data Management UI. Implement features here later.</p>
          <div className="mt-4">
            <Button onClick={() => alert('Stub action')}>Run Migration (stub)</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
