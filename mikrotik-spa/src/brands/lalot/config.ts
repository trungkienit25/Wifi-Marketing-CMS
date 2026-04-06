export const BrandConfig = {
  id: 'lalot',
  name: 'Lá Lốt Restaurant',
  theme: {
    primaryColor: '#10b981', // Emerald 500
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  },
  survey: [
    { id: 'age', type: 'radio', label: { vi: 'Độ tuổi', en: 'Age' }, options: ['18-25', '26-40', '40+'], required: true },
    { id: 'source', type: 'radio', label: { vi: 'Nguồn biết tới quán', en: 'How did you know us?' }, options: ['Social Media', 'Friends', 'Passerby'], required: false }
  ]
};
