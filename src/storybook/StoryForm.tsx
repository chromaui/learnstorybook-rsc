import React, { FormEvent, Fragment, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { MockData } from './msw';

export const StoryForm = ({
  savedData,
  saveStory,
}: {
  savedData: MockData;
  saveStory: (name: string, url: string, data: MockData) => Promise<void>;
}) => {
  const params = useSearchParams();
  const url = `${usePathname()}${params ? `?${params}` : ''}`;
  const [name, setName] = useState('');
  const [selectedSavedData, setSelectedSavedData] = useState(
    Object.keys(savedData).map(() => true)
  );
  const toggleSelectSavedData = (index: number) => {
    selectedSavedData[index] = !selectedSavedData[index];
    setSelectedSavedData(selectedSavedData);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const dataSubset = Object.fromEntries(
      Object.entries(savedData).filter((_, index) => selectedSavedData[index])
    );
    saveStory(name, url, dataSubset);
  };

  return (
    <form onSubmit={submit} style={{ padding: '5px', margin: '5px', background: '#ddd' }}>
      <h5>Save current route</h5>
      <input
        name="name"
        type="text"
        placeholder="Name your story"
        style={{ padding: 0 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h5>Save data</h5>
      {Object.entries(savedData).map(([url, data], index) => (
        <Fragment key={index}>
          <label>
            <input
              type="checkbox"
              key={index}
              onChange={() => toggleSelectSavedData(index)}
              checked={selectedSavedData[index]}
            />
            <code>{url}</code>
          </label>
          <pre
            style={{
              background: '#eee',
              maxHeight: '50px',
              overflow: 'scroll',
            }}
          >
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </Fragment>
      ))}
      <button type="submit">Go</button>
    </form>
  );
};
