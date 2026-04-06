/**
 * Disaster Recovery Assets for MikroTik WiFi Marketing.
 * Contains lightweight Base64 placeholders to ensure the UI stays 
 * functional even during total Cloud/Internet disconnect.
 */

export const OFFLINE_CONTENT = {
  meta: {
    brandId: 'brand-offline',
    brandName: 'Local Guest WiFi',
  },
  ads: [
    {
      adId: 'offline-001',
      title: 'Welcome to our Venue',
      subtitle: 'Premium High-Speed Internet Authorized',
      // Placeholder: Simple blue gradient 4:5
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU39AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJ0lEQVR42mNkYGD4z8DAwMDIwMAAhCDMwMDwHyZBgYEBCHfAJEG8PxAB6S0R9iU4KAAAAABJRU5ErkJggg==',
      link: '#',
    },
    {
      adId: 'offline-002',
      title: 'Our Partners',
      subtitle: 'Explore local offers near you',
      // Placeholder: Simple silver gradient 1:1
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      link: '#',
    }
  ]
};
