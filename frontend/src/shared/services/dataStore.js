// Frontend-only data store using localStorage
// This simulates a backend for demo purposes

const STORAGE_KEYS = {
  PARENTS: 'imha_parents',
  MEDIA: 'imha_media',
  ACTIVITIES: 'imha_activities',
  MEALS: 'imha_meals',
  CHILDREN: 'imha_children',
};

// Initialize with mock data if empty
const initializeStore = () => {
  const defaultMedia = [
    {
      id: '1',
      type: 'photo',
      url: 'https://via.placeholder.com/400x300?text=Art+Project',
      thumbnail: 'https://via.placeholder.com/200x150?text=Art+Project',
      title: 'Art Project - Rainbow',
      description: 'Emma created a beautiful rainbow painting during art therapy',
      date: new Date().toISOString(),
      activityId: '2',
    },
    {
      id: '2',
      type: 'photo',
      url: 'https://via.placeholder.com/400x300?text=Math+Activity',
      thumbnail: 'https://via.placeholder.com/200x150?text=Math+Activity',
      title: 'Counting Activity',
      description: 'Using counting blocks during math lesson',
      date: new Date().toISOString(),
      activityId: '1',
    },
  ];

  const defaultActivities = [
    {
      id: '1',
      date: new Date().toISOString(),
      title: 'Math Activity - Counting',
      description: 'Emma practiced counting from 1 to 20 using visual aids. She showed great progress and stayed focused throughout the activity.',
      type: 'Learning',
      duration: 30,
      teacher: 'Ms. Maria Garcia',
      studentEngagement: 'High',
      notes: 'Emma enjoyed using the counting blocks. Will continue with number recognition next week.',
    },
  ];

  const defaultMeals = [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      mealType: 'Breakfast',
      mealName: 'Scrambled Eggs & Toast',
      description: 'Scrambled eggs with whole wheat toast and fresh fruit',
      quantity: 'Full portion',
      specialNotes: 'No dairy products',
      time: '08:30',
      eaten: true,
    },
  ];

  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(defaultMedia));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEALS)) {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(defaultMeals));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARENTS)) {
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHILDREN)) {
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify([]));
  }
};

// Initialize on import
initializeStore();

export const dataStore = {
  // Parents
  getParents: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PARENTS);
    return data ? JSON.parse(data) : [];
  },

  createParent: (parentData) => {
    const parents = dataStore.getParents();
    const newParent = {
      ...parentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    parents.push(newParent);
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(parents));
    return newParent;
  },

  updateParent: (id, parentData) => {
    const parents = dataStore.getParents();
    const index = parents.findIndex(p => p.id === id);
    if (index !== -1) {
      parents[index] = { ...parents[index], ...parentData };
      localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(parents));
      return parents[index];
    }
    return null;
  },

  deleteParent: (id) => {
    const parents = dataStore.getParents();
    const filtered = parents.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(filtered));
    return true;
  },

  // Media
  getMedia: () => {
    const data = localStorage.getItem(STORAGE_KEYS.MEDIA);
    return data ? JSON.parse(data) : [];
  },

  createMedia: (mediaData) => {
    const media = dataStore.getMedia();
    const newMedia = {
      ...mediaData,
      id: Date.now().toString(),
      thumbnail: mediaData.thumbnail || mediaData.url,
      date: mediaData.date || new Date().toISOString(),
    };
    media.push(newMedia);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
    return newMedia;
  },

  updateMedia: (id, mediaData) => {
    const media = dataStore.getMedia();
    const index = media.findIndex(m => m.id === id);
    if (index !== -1) {
      media[index] = { ...media[index], ...mediaData };
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
      return media[index];
    }
    return null;
  },

  deleteMedia: (id) => {
    const media = dataStore.getMedia();
    const filtered = media.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(filtered));
    return true;
  },

  // Activities
  getActivities: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },

  createActivity: (activityData) => {
    const activities = dataStore.getActivities();
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      date: activityData.date || new Date().toISOString(),
    };
    activities.push(newActivity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return newActivity;
  },

  updateActivity: (id, activityData) => {
    const activities = dataStore.getActivities();
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
      activities[index] = { ...activities[index], ...activityData };
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      return activities[index];
    }
    return null;
  },

  deleteActivity: (id) => {
    const activities = dataStore.getActivities();
    const filtered = activities.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filtered));
    return true;
  },

  // Meals
  getMeals: () => {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  },

  createMeal: (mealData) => {
    const meals = dataStore.getMeals();
    const newMeal = {
      ...mealData,
      id: Date.now().toString(),
      date: mealData.date || new Date().toISOString().split('T')[0],
    };
    meals.push(newMeal);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    return newMeal;
  },

  updateMeal: (id, mealData) => {
    const meals = dataStore.getMeals();
    const index = meals.findIndex(m => m.id === id);
    if (index !== -1) {
      meals[index] = { ...meals[index], ...mealData };
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
      return meals[index];
    }
    return null;
  },

  deleteMeal: (id) => {
    const meals = dataStore.getMeals();
    const filtered = meals.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(filtered));
    return true;
  },

  // Children
  getChildren: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    return data ? JSON.parse(data) : [];
  },

  createChild: (childData) => {
    const children = dataStore.getChildren();
    const newChild = {
      ...childData,
      id: Date.now().toString(),
    };
    children.push(newChild);
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    return newChild;
  },

  updateChild: (id, childData) => {
    const children = dataStore.getChildren();
    const index = children.findIndex(c => c.id === id);
    if (index !== -1) {
      children[index] = { ...children[index], ...childData };
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
      return children[index];
    }
    return null;
  },

  deleteChild: (id) => {
    const children = dataStore.getChildren();
    const filtered = children.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(filtered));
    return true;
  },
};

