import { render } from '@testing-library/react';

import MuiActionForm from './mui-action-form';

describe('MuiActionForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MuiActionForm />);
    expect(baseElement).toBeTruthy();
  });
});
