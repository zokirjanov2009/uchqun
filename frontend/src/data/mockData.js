// Mock data for frontend development
// This will be replaced with real API calls later

export const mockUser = {
  id: '1',
  email: 'parent@example.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  phone: '+1 (555) 123-4567',
  role: 'parent',
  avatar: null,
};

export const mockChild = {
  id: '1',
  firstName: 'Emma',
  lastName: 'Johnson',
  dateOfBirth: '2018-05-15',
  age: 6,
  gender: 'Female',
  disabilityType: 'Autism Spectrum Disorder',
  specialNeeds: 'Requires visual aids and structured routine',
  photo: 'https://via.placeholder.com/200',
  school: 'Sunshine Special Education School',
  class: 'Class A',
  teacher: 'Ms. Maria Garcia',
  emergencyContact: {
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    relationship: 'Mother',
  },
};

export const mockActivities = [
  {
    id: '1',
    date: '2024-01-15',
    title: 'Math Activity - Counting',
    description: 'Emma practiced counting from 1 to 20 using visual aids. She showed great progress and stayed focused throughout the activity.',
    type: 'Learning',
    duration: 30,
    teacher: 'Ms. Maria Garcia',
    studentEngagement: 'High',
    notes: 'Emma enjoyed using the counting blocks. Will continue with number recognition next week.',
  },
  {
    id: '2',
    date: '2024-01-15',
    title: 'Art Therapy Session',
    description: 'Creative painting session focusing on color recognition and fine motor skills.',
    type: 'Therapy',
    duration: 45,
    teacher: 'Ms. Maria Garcia',
    studentEngagement: 'High',
    notes: 'Emma created a beautiful rainbow painting. Very engaged and happy.',
  },
  {
    id: '3',
    date: '2024-01-14',
    title: 'Social Skills Group',
    description: 'Group activity focusing on turn-taking and sharing. Emma interacted well with peers.',
    type: 'Social',
    duration: 40,
    teacher: 'Ms. Maria Garcia',
    studentEngagement: 'Medium',
    notes: 'Good progress in social interactions. Encouraged to continue practicing at home.',
  },
  {
    id: '4',
    date: '2024-01-14',
    title: 'Reading Time',
    description: 'Read "The Very Hungry Caterpillar" together. Emma identified colors and animals.',
    type: 'Learning',
    duration: 25,
    teacher: 'Ms. Maria Garcia',
    studentEngagement: 'High',
    notes: 'Emma loves story time. Will introduce more interactive books.',
  },
  {
    id: '5',
    date: '2024-01-13',
    title: 'Physical Activity',
    description: 'Outdoor play and movement exercises. Emma participated in all activities.',
    type: 'Physical',
    duration: 30,
    teacher: 'Ms. Maria Garcia',
    studentEngagement: 'High',
    notes: 'Great energy and coordination. Enjoyed the playground equipment.',
  },
];

export const mockMeals = [
  {
    id: '1',
    date: '2024-01-15',
    mealType: 'Breakfast',
    mealName: 'Scrambled Eggs & Toast',
    description: 'Scrambled eggs with whole wheat toast and fresh fruit',
    quantity: 'Full portion',
    specialNotes: 'No dairy products',
    time: '08:30',
    eaten: true,
  },
  {
    id: '2',
    date: '2024-01-15',
    mealType: 'Lunch',
    mealName: 'Grilled Chicken & Vegetables',
    description: 'Grilled chicken breast with steamed broccoli and carrots, served with rice',
    quantity: 'Full portion',
    specialNotes: 'All vegetables eaten',
    time: '12:15',
    eaten: true,
  },
  {
    id: '3',
    date: '2024-01-15',
    mealType: 'Snack',
    mealName: 'Apple Slices & Crackers',
    description: 'Fresh apple slices with whole grain crackers',
    quantity: 'Half portion',
    specialNotes: 'Enjoyed the apple slices',
    time: '15:00',
    eaten: true,
  },
  {
    id: '4',
    date: '2024-01-14',
    mealType: 'Breakfast',
    mealName: 'Oatmeal & Berries',
    description: 'Warm oatmeal with fresh blueberries and strawberries',
    quantity: 'Full portion',
    specialNotes: 'Loved the berries',
    time: '08:30',
    eaten: true,
  },
  {
    id: '5',
    date: '2024-01-14',
    mealType: 'Lunch',
    mealName: 'Pasta with Tomato Sauce',
    description: 'Whole wheat pasta with homemade tomato sauce and vegetables',
    quantity: 'Full portion',
    specialNotes: 'Finished everything',
    time: '12:15',
    eaten: true,
  },
];

export const mockMedia = [
  {
    id: '1',
    type: 'photo',
    url: 'https://via.placeholder.com/400x300?text=Art+Project',
    thumbnail: 'https://via.placeholder.com/200x150?text=Art+Project',
    title: 'Art Project - Rainbow',
    description: 'Emma created a beautiful rainbow painting during art therapy',
    date: '2024-01-15',
    activityId: '2',
  },
  {
    id: '2',
    type: 'photo',
    url: 'https://via.placeholder.com/400x300?text=Math+Activity',
    thumbnail: 'https://via.placeholder.com/200x150?text=Math+Activity',
    title: 'Counting Activity',
    description: 'Using counting blocks during math lesson',
    date: '2024-01-15',
    activityId: '1',
  },
  {
    id: '3',
    type: 'video',
    url: 'https://via.placeholder.com/400x300?text=Video',
    thumbnail: 'https://via.placeholder.com/200x150?text=Video',
    title: 'Reading Time',
    description: 'Emma reading "The Very Hungry Caterpillar"',
    date: '2024-01-14',
    activityId: '4',
  },
  {
    id: '4',
    type: 'photo',
    url: 'https://via.placeholder.com/400x300?text=Playground',
    thumbnail: 'https://via.placeholder.com/200x150?text=Playground',
    title: 'Playground Fun',
    description: 'Outdoor play and physical activity',
    date: '2024-01-13',
    activityId: '5',
  },
  {
    id: '5',
    type: 'photo',
    url: 'https://via.placeholder.com/400x300?text=Social+Skills',
    thumbnail: 'https://via.placeholder.com/200x150?text=Social+Skills',
    title: 'Group Activity',
    description: 'Social skills group session',
    date: '2024-01-14',
    activityId: '3',
  },
];

export const mockProgress = {
  academic: {
    math: 'Good progress in counting and number recognition',
    reading: 'Showing interest in books and stories',
    writing: 'Improving fine motor skills',
  },
  social: {
    peerInteraction: 'More comfortable with group activities',
    communication: 'Using more words and gestures',
    sharing: 'Learning to take turns',
  },
  behavioral: {
    focus: 'Able to focus for longer periods',
    routine: 'Following daily routines well',
    transitions: 'Handling transitions better',
  },
};

// Mock API functions (placeholders for future backend integration)
export const mockApi = {
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === 'parent@example.com' && password === 'password') {
      return {
        success: true,
        user: mockUser,
        token: 'mock-jwt-token',
      };
    }
    throw new Error('Invalid credentials');
  },

  getChild: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockChild;
  },

  getActivities: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockActivities;
  },

  getMeals: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockMeals;
  },

  getMedia: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockMedia;
  },

  getProgress: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockProgress;
  },
};

