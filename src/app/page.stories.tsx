import { StoryObj, Meta } from '@storybook/react';

import InboxScreen from './page';
import * as TaskListStories from '../components/TaskList.stories';

import { fireEvent, waitFor, within, waitForElementToBeRemoved } from '@storybook/test';

const meta = {
  component: InboxScreen,
} satisfies Meta<typeof InboxScreen>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Waits for the component to transition from the loading state
    await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
    // Waits for the component to be updated based on the store
    await waitFor(async () => {
      // Simulates pinning the first task
      await fireEvent.click(canvas.getByLabelText('pinTask-1'));
      // Simulates pinning the third task
      await fireEvent.click(canvas.getByLabelText('pinTask-3'));
    });
  },
} satisfies Story;

// export const Error = {
//   parameters: {
//     msw: {
//       handlers: [
//         rest.get('https://jsonplaceholder.typicode.com/todos?userId=1', (req, res, ctx) => {
//           return res(ctx.status(403));
//         }),
//       ],
//     },
//   },
// } satisfies Story;
