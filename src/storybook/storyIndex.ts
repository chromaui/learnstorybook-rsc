export type StoryId = string;
export type IndexEntry = {
  title: string;
  name: string;
  key: string;
  importPath: string;
};
export type StoryIndex = Record<StoryId, IndexEntry>;
