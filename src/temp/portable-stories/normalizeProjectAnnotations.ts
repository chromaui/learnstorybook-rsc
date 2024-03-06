import type {
  Renderer,
  ArgTypes,
  ProjectAnnotations,
  NormalizedProjectAnnotations,
} from '@storybook/types';

import { normalizeInputTypes } from './normalizeInputTypes';
import { normalizeArrays } from './normalizeArrays';

export function normalizeProjectAnnotations<TRenderer extends Renderer>({
  argTypes,
  globalTypes,
  argTypesEnhancers,
  decorators,
  loaders,
  ...annotations
}: ProjectAnnotations<TRenderer>): NormalizedProjectAnnotations<TRenderer> {
  return {
    ...(argTypes && { argTypes: normalizeInputTypes(argTypes as ArgTypes) }),
    ...(globalTypes && { globalTypes: normalizeInputTypes(globalTypes) }),
    decorators: normalizeArrays(decorators),
    loaders: normalizeArrays(loaders),
    argTypesEnhancers: [...(argTypesEnhancers || [])],
    ...annotations,
  };
}
