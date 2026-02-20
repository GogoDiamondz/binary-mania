import React from 'react';

import './home.css';

import { Login } from './login';
import { Profile } from './profile';
import { AuthState } from './authState';

export function Home({ userName, authState, onAuthChange }) {
    return (
        <main className="home-main">
            <div>
                {authState === AuthState.Unknown && (
                    <h1>Welcome to Binary Mania</h1>
                )}
                {authState === AuthState.Unauthenticated && (
                    <Login 
                        userName={userName}
                        onLogin={(inputUserName) => {
                            onAuthChange(inputUserName, AuthState.Authenticated)
                        }}
                    />
                )}
                {authState === AuthState.Authenticated && (
                    <Profile 
                        userName={userName} 
                        onLogout={() => {
                            onAuthChange('', AuthState.Unauthenticated);
                        }}
                    />
                )}
            </div>
        </main>
    );
}