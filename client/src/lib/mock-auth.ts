interface StoredUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

const STORAGE_KEY = 'mock_users';
const SESSION_KEY = 'current_user';

export const mockUsers: StoredUser[] = [
  {
    id: "1",
    email: "admin@bukidnimanang.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    password: "Admin@123"
  },
  {
    id: "2",
    email: "user@example.com",
    firstName: "Regular",
    lastName: "User",
    role: "user",
    password: "User@123"
  }
];

export const initMockAuth = () => {
  console.log('Initializing mock auth...');
  const existingUsers = localStorage.getItem(STORAGE_KEY);
  if (!existingUsers) {
    console.log('Setting up mock users:', mockUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
  } else {
    console.log('Existing users found:', JSON.parse(existingUsers));
  }
};

export const mockLogin = async (email: string, password: string) => {
  console.log('Mock login attempt:', { email });
  const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  console.log('Available users:', users);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.error('Login failed: No matching user found for', email);
    throw new Error('Invalid credentials');
  }
  console.log('Login successful for user:', { ...user, password: '[REDACTED]' });

  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
};

export const mockRegister = async (userData: Omit<StoredUser, "id"> & { password: string }) => {
  try {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.role) {
      throw new Error('All fields are required');
    }

    // Get existing users
    let users: StoredUser[] = [];
    try {
      const existingUsers = localStorage.getItem(STORAGE_KEY);
      users = existingUsers ? JSON.parse(existingUsers) : [];
    } catch (e) {
      console.error('Error reading users from storage:', e);
      users = [];
    }
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }

    const newUser: StoredUser = {
      id: (users.length + 1).toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      password: userData.password
    };

    users.push(newUser);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to storage:', e);
      throw new Error('Failed to save user data. Please try again.');
    }

    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  } catch (error) {
    console.error('Error during registration:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to register user. Please try again.');
    }
  }
};

export const mockLogout = async () => {
  localStorage.removeItem(SESSION_KEY);
};

export const mockCheckAuth = async () => {
  const userJson = localStorage.getItem(SESSION_KEY);
  if (!userJson) return null;
  return JSON.parse(userJson);
};