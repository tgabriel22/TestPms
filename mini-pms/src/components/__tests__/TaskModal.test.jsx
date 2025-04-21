import { render, screen } from '@testing-library/react';
import TaskModal from '../TaskModal';

test('renders TaskModal button', () => {
  render(<TaskModal open={false} setOpen={() => {}} />);
  expect(screen.getByText('+ Создать задачу')).toBeInTheDocument();
});
