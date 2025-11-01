import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../hooks/auth-provider';
import { mockUsers } from '../data/mockData';

function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="auth-user">{user?.email || 'none'}</div>
      <button onClick={() => login(mockUsers[0].email, 'password123')}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe('Auth Provider (component)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated and can login/logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('no');
    expect(screen.getByTestId('auth-user').textContent).toBe('none');

    // perform login
    screen.getByText('login').click();

    await waitFor(() => expect(screen.getByTestId('auth-status').textContent).toBe('yes'));
    expect(screen.getByTestId('auth-user').textContent).toBe(mockUsers[0].email);

    // perform logout
    screen.getByText('logout').click();
    await waitFor(() => expect(screen.getByTestId('auth-status').textContent).toBe('no'));
    expect(screen.getByTestId('auth-user').textContent).toBe('none');
  });
});
