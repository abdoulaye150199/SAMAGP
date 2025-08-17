export declare const tailwindConfig: {
    theme: {
        extend: {
            colors: {
                aqua: string;
                'aqua-light': string;
                'aqua-dark': string;
                dark: string;
                'dark-light': string;
                'dark-dark': string;
            };
            animation: {
                'slide-in': string;
                'slide-out': string;
                'bounce-in': string;
                'fade-out': string;
            };
            keyframes: {
                slideIn: {
                    '0%': {
                        transform: string;
                        opacity: string;
                    };
                    '100%': {
                        transform: string;
                        opacity: string;
                    };
                };
                slideOut: {
                    '0%': {
                        transform: string;
                        opacity: string;
                    };
                    '100%': {
                        transform: string;
                        opacity: string;
                    };
                };
                bounceIn: {
                    '0%': {
                        transform: string;
                        opacity: string;
                    };
                    '50%': {
                        transform: string;
                    };
                    '70%': {
                        transform: string;
                    };
                    '100%': {
                        transform: string;
                        opacity: string;
                    };
                };
                fadeOut: {
                    '0%': {
                        opacity: string;
                    };
                    '100%': {
                        opacity: string;
                    };
                };
            };
        };
    };
};
export declare function initializeTailwindConfig(): void;
//# sourceMappingURL=TailwindConfig.d.ts.map