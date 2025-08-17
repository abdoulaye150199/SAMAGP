// src/ts/config/TailwindConfig.ts
export const tailwindConfig = {
    theme: {
        extend: {
            colors: {
                'aqua': '#00D4AA',
                'aqua-light': '#4DE6CD',
                'aqua-dark': '#00A085',
                'dark': '#1A1A1A',
                'dark-light': '#2D2D2D',
                'dark-dark': '#0F0F0F'
            },
            animation: {
                'slide-in': 'slideIn 0.5s ease-out',
                'slide-out': 'slideOut 0.3s ease-in forwards',
                'bounce-in': 'bounceIn 0.6s ease-out',
                'fade-out': 'fadeOut 0.3s ease-in forwards'
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                slideOut: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(-100%)', opacity: '0' }
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                }
            }
        }
    }
};
// Configuration globale de Tailwind
export function initializeTailwindConfig() {
    if (typeof window.tailwind !== 'undefined') {
        window.tailwind.config = tailwindConfig;
    }
}
//# sourceMappingURL=TailwindConfig.js.map