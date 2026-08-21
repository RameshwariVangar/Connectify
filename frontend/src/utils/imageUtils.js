import { BASE_URL } from '@/config';

// Resilient inline SVG data URI placeholder for missing or broken user avatars
export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2394a3b8"><circle cx="50" cy="35" r="22"/><path d="M12 88 c0-20 17-34 38-34 s38 14 38 34 Z"/></svg>`;

export const getImageUrl = (imagePath) => {
   if (!imagePath || imagePath === "ProfileConnect.jpg" || imagePath === "undefined" || imagePath.trim() === "") {
      return DEFAULT_AVATAR;
   }
   if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
   }
   return `${BASE_URL}/${imagePath}`;
};

export const handleImageError = (e) => {
   if (e.target.src !== DEFAULT_AVATAR) {
      e.target.onerror = null;
      e.target.src = DEFAULT_AVATAR;
   }
};
