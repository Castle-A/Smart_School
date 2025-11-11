import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import AuthContext from '../../context/authContextObj';
import type { AuthContextType } from '../../types/auth';

const MockAuthProvider = ({ value, children }: { value: Partial<AuthContextType>; children: React.ReactNode }) => {
  return <AuthContext.Provider value={value as AuthContextType}>{children}</AuthContext.Provider>;
};

test('redirects unauthenticated users to /login', () => {
  const authValue: Partial<AuthContextType> = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
  };

  render(
    <MockAuthProvider value={authValue}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/protected" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    </MockAuthProvider>
  );

  expect(screen.getByText('Login Page')).toBeInTheDocument();
});
