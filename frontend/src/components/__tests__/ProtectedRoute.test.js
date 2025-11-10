import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import AuthContext from '../../context/AuthContext';
const MockAuthProvider = ({ value, children }) => {
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
test('redirects unauthenticated users to /login', () => {
    const authValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
    };
    render(_jsx(MockAuthProvider, { value: authValue, children: _jsx(MemoryRouter, { initialEntries: ["/protected"], children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx("div", { children: "Login Page" }) }), _jsx(Route, { path: "/protected", element: _jsx(ProtectedRoute, { children: _jsx("div", { children: "Secret" }) }) })] }) }) }));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
});
