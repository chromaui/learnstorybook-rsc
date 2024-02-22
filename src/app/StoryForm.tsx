'use client';

import { usePathname, useSearchParams } from 'next/navigation';

export const StoryForm = ({ saveStory }: { saveStory: (_: FormData) => Promise<void> }) => {
  const url = `${usePathname()}?${useSearchParams()}`;
  return (
    <form action={saveStory} style={{ padding: '5px', margin: '5px', background: '#ddd' }}>
      <h5>Save current route</h5>
      <input name="url" type="hidden" value={url} />
      <input name="name" type="text" placeholder="Name your story" style={{ padding: 0 }} />
      <button type="submit">Go</button>
    </form>
  );
};
