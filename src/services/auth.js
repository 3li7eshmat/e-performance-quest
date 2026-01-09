import { getUsers } from './data';

export const login = (username) => {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: 'User not found' };
};

export const logout = () => {
    localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};
