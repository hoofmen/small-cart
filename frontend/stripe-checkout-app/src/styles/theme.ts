import { Appearance } from '@stripe/stripe-js';

export const darkTheme: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#ffb3c7', // Klarna pink
    colorBackground: '#000000',
    colorText: '#ffffff',
    colorDanger: '#ff4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
    colorIconTab: '#ffffff',
    colorIconTabHover: '#ffb3c7',
    colorIconTabSelected: '#ffb3c7',
  },
  rules: {
    '.Tab': {
      border: '1px solid #333333',
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    },
    '.Tab:hover': {
      border: '1px solid #555555',
    },
    '.Tab--selected': {
      borderColor: '#ffb3c7',
    },
    '.Label': {
      color: '#cccccc',
    },
    '.Input': {
      backgroundColor: '#111111',
      color: '#ffffff',
      borderColor: '#333333',
    },
    '.Input:focus': {
      borderColor: '#ffb3c7',
    },
  }
};

export const commonStyles = {
  container: "min-h-screen bg-black text-white",
  contentWrapper: "container mx-auto px-4 py-16",
  card: "bg-zinc-900 p-8 rounded-lg border border-zinc-800",
  heading: "text-3xl font-bold mb-8 text-center",
  button: {
    primary: "w-full py-4 px-6 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400",
    secondary: "w-full py-3 px-4 bg-transparent text-zinc-400 hover:text-white text-sm rounded-lg transition-colors",
    danger: "w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition"
  },
  error: "bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded",
  divider: "border-t border-zinc-800",
  text: {
    primary: "text-white",
    secondary: "text-zinc-400",
    muted: "text-zinc-500"
  }
}; 