import { mockFn } from '../../mock';
import { getTask as getTaskOriginal, getTasks as getTasksOriginal } from '../tasks';

export const getTask = mockFn(getTaskOriginal, 'getTask');
export const getTasks = mockFn(getTasksOriginal, 'getTasks');
